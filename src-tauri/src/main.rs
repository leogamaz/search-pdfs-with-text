#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::path::Path;
use tauri::api::process::Command;

#[tauri::command]
async fn hello_world_command(_app: tauri::AppHandle) -> Result<String, String> {
  println!("I was invoked from JS!");
  Ok("Hello world from Tauri!".into())
}

#[tauri::command]
async fn reveal_in_explorer(path: String) -> Result<(), String> {
  let full_path = Path::new(&path)
      .canonicalize()
      .map_err(|e| e.to_string())?;

  #[cfg(target_os = "windows")]
  {
      Command::new("explorer")
          .args(["/select,", full_path.to_str().unwrap()])
          .spawn()
          .map_err(|e| e.to_string())?;
  }

  #[cfg(target_os = "macos")]
  {
      Command::new("open")
          .args(["-R", full_path.to_str().unwrap()])
          .spawn()
          .map_err(|e| e.to_string())?;
  }

  #[cfg(target_os = "linux")]
  {
      Command::new("xdg-open")
          .arg(full_path.parent().unwrap())
          .spawn()
          .map_err(|e| e.to_string())?;
  }

  Ok(())
}

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![hello_world_command, reveal_in_explorer])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}