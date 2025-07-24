use std::{
  io::{BufRead, BufReader},
  process::{Command, Stdio},
};

use tauri::tray::TrayIconBuilder;
use tauri::{path::BaseDirectory, Emitter, Manager};
use tauri_plugin_fs::FsExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      let config_dir = app
        .path()
        .resolve("uiplay", BaseDirectory::Config)
        .expect("Failed to resolve config dir")
        .to_string_lossy()
        .to_string();
      // allowed the given directory
      let scope = app.fs_scope();
      let _ = scope.allow_directory(&config_dir, false);

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
  let check = Command::new("pgrep").arg("uxplay").output();

  let mut killed = false;

  match check {
    Ok(output) if !output.stdout.is_empty() => {
      log_output(app.clone(), "UxPlay is already running, restarting...");
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
          log_output(app.clone(), format!("Failed to kill UxPlay: {}", e));
          return;
        }
      }
    }
    Ok(_) => {
      log_output(app.clone(), "UxPlay is not running, starting a new instance...");
    }
    Err(e) => {
      log_output(app.clone(), format!("Failed to check if UxPlay is running: {}", e));
      return;
    }
  }

  if killed {
    log_output(app.clone(), "Previous UxPlay process killed. Starting new instance...");
  }

  // import the default GStreamer plugin path
  let default_path = "/usr/lib/gstreamer-1.0";
  let user_path = std::env::var("GST_PLUGIN_PATH").unwrap_or_default();
  let merged = format!("{}:{}", user_path, default_path);

  let mut child = Command::new("stdbuf")
    .env("GST_PLUGIN_PATH", merged)
    .arg("-oL") // force line buffering for stdout
    .arg("uxplay")
    .arg("-n")
    .arg("UiPlay")
    .arg("-ca") // show album art
    .arg(
      app.path()
        .resolve("uiplay/albumart.png", BaseDirectory::Config)
        .expect("Failed to resolve uiplay/albumart.png")
        .to_string_lossy()
        .to_string(),
    )
    .arg("-async") // enable async mode
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
        Ok(l) => log_output(app_stdout.clone(), l),
        Err(e) => log_output(app_stdout.clone(), format!("Error reading stdout: {}", e)),
      };
    }
  });

  let stderr_thread = std::thread::spawn(move || {
    let reader = BufReader::new(stderr);
    for line in reader.lines() {
      match line {
        Ok(l) => log_output(app_stderr.clone(), format!("[STDERR] {}", l)),
        Err(e) => log_output(app_stderr.clone(), format!("Error reading stderr: {}", e)),
      };
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

fn log_output(
    app: tauri::AppHandle,
    output: impl Into<String>,
) {
    let message = output.into();
    println!("{}", message);
    app.emit("uxplay-output", message).unwrap();
}