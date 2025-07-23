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
fn start_uxplay() {
  println!("Starting uxplay...");
  let mut cmd = Command::new("uxplay");

  match cmd.output() {
    Ok(output) => {
      println!("uxplay stdout: {}", String::from_utf8_lossy(&output.stdout));
      println!("uxplay stderr: {}", String::from_utf8_lossy(&output.stderr));
      println!("uxplay exit status: {}", output.status);
    }
    Err(e) => {
      eprintln!("Failed to start uxplay: {}", e);
    }
  }
}