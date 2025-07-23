use std::{io::{BufRead, BufReader}, process::{Command, Stdio}};

use tauri::Emitter;
use tauri::tray::TrayIconBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .build(app)?;

      tauri::async_runtime::spawn(start_uxplay(app.handle().clone()));

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![start_uxplay])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn start_uxplay(app: tauri::AppHandle) {
  println!("Checking if uxplay is already running...");
  let check = Command::new("pgrep")
    .arg("uxplay")
    .output();

  let mut killed = false;

  match check {
    Ok(output) if !output.stdout.is_empty() => {
      println!("uxplay is already running, restarting...");
      app.emit("uxplay-output", "uxplay is already running, restarting...").unwrap();
      // Kill the existing uxplay process and wait for it to exit
      let kill = Command::new("pkill")
        .arg("uxplay")
        .output();
      match kill {
        Ok(_) => {
          killed = true;
          // Wait until no uxplay process is running
          for _ in 0..10 {
            let check_again = Command::new("pgrep")
              .arg("uxplay")
              .output();
            match check_again {
              Ok(out) if out.stdout.is_empty() => break,
              _ => std::thread::sleep(std::time::Duration::from_millis(200)),
            }
          }
        }
        Err(e) => {
          eprintln!("Failed to kill existing uxplay process: {}", e);
          app.emit("uxplay-output", format!("Failed to kill uxplay: {}", e)).unwrap();
          return;
        }
      }
    }
    Ok(_) => {
      println!("uxplay is not running. Starting uxplay...");
      app.emit("uxplay-output", "Starting uxplay...").unwrap();
    }
    Err(e) => {
      eprintln!("Failed to check if uxplay is running: {}", e);
      app.emit("uxplay-output", format!("Failed to check uxplay: {}", e)).unwrap();
      return;
    }
  }

  if killed {
    app.emit("uxplay-output", "Previous uxplay process killed. Starting new instance...").unwrap();
  }

  let mut child = Command::new("stdbuf")
    .arg("-oL") // force line buffering for stdout
    .arg("uxplay")
    .arg("-n")
    .arg("UiPlay")
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .expect("Failed to start uxplay with stdbuf");

  let stdout = child.stdout.take().expect("Failed to capture stdout");
  let stderr = child.stderr.take().expect("Failed to capture stderr");

  let app_stdout = app.clone();
  let app_stderr = app.clone();

  let stdout_thread = std::thread::spawn(move || {
    let reader = BufReader::new(stdout);
    for line in reader.lines() {
      match line {
        Ok(l) => app_stdout.emit("uxplay-output", l).unwrap(),
        Err(e) => {
          eprintln!("Error reading stdout: {}", e);
          app_stdout.emit("uxplay-output", format!("Error reading stdout: {}", e)).unwrap();
        },
      }
    }
  });

  let stderr_thread = std::thread::spawn(move || {
    let reader = BufReader::new(stderr);
    for line in reader.lines() {
      match line {
        Ok(l) => app_stderr.emit("uxplay-output", format!("[STDERR] {}", l)).unwrap(),
        Err(e) => eprintln!("Error reading stderr: {}", e),
      }
    }
  });

  let status = child.wait().expect("Failed to wait on child");
  stdout_thread.join().expect("Failed to join stdout thread");
  stderr_thread.join().expect("Failed to join stderr thread");

  app.emit("uxplay-output", format!("uxplay process exited with status: {}", status)).unwrap();
  println!("Process exited with status: {}", status);

  // Attempt to start uxplay again
  app.emit("uxplay-output", "Trying to start uxplay again...").unwrap();
  std::thread::spawn(move || {
    tauri::async_runtime::block_on(start_uxplay(app));
  });
}