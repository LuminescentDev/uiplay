use std::process::Command;

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
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![start_uxplay])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn start_uxplay() {
  println!("Checking if uxplay is already running...");
  let check = Command::new("pgrep")
    .arg("uxplay")
    .output();

  match check {
    Ok(output) if !output.stdout.is_empty() => {
      println!("uxplay is already running.");
      return;
    }
    Ok(_) => {
      println!("uxplay is not running. Starting uxplay...");
    }
    Err(e) => {
      eprintln!("Failed to check if uxplay is running: {}", e);
      return;
    }
  }

  let mut cmd = Command::new("uxplay");
  // Inherit stdout/stderr so output appears in the terminal
  match cmd.spawn() {
    Ok(mut child) => {
      match child.wait() {
        Ok(status) => {
          println!("uxplay exited with status: {}", status);
        }
        Err(e) => {
          eprintln!("Failed to wait on uxplay: {}", e);
        }
      }
    }
    Err(e) => {
      eprintln!("Failed to start uxplay: {}", e);
    }
  }
}