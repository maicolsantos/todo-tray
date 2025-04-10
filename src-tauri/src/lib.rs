use tauri::Manager; // For get_webview_window
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri::PhysicalPosition; // For setting window position
use std::sync::{Arc, Mutex}; // For debouncing clicks

pub fn run() {
    // Use a mutex to track the last click time for debouncing
    let last_click = Arc::new(Mutex::new(None::<std::time::Instant>));
    let last_click_clone = last_click.clone();

    tauri::Builder::default()
        .setup(|app| {
            // Hide the window on startup
            let window = app.get_webview_window("main").unwrap();
            window.hide().unwrap();

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("My App")
                .on_tray_icon_event(move |tray, event| {
                    let app = tray.app_handle();
                    if let TrayIconEvent::Click { position, button, .. } = event {
                        // Only handle left clicks
                        if button != tauri::tray::MouseButton::Left {
                            return;
                        }

                        // Debounce: ignore clicks within 300ms
                        let now = std::time::Instant::now();
                        let mut last_click = last_click_clone.lock().unwrap();
                        if let Some(last) = *last_click {
                            if now.duration_since(last) < std::time::Duration::from_millis(300) {
                                return;
                            }
                        }
                        *last_click = Some(now);

                        println!("Tray clicked at position: {:?}", position);
                        let window = app.get_webview_window("main").unwrap();

                        // Toggle window visibility
                        let is_visible = window.is_visible().unwrap_or(false);
                        if !is_visible {
                            // Set position every time we show to ensure it stays centered
                            let size = window.outer_size().unwrap();
                            let window_width = size.width as f64;
                            let window_height = size.height as f64;

                            let tray_x = position.x;
                            let tray_y = position.y;

                            let new_x = tray_x - (window_width / 2.0); // Center horizontally
                            let new_y = tray_y - window_height; // Above tray

                            // Keep it on screen
                            let monitor = window.current_monitor().unwrap().unwrap();
                            let monitor_size = monitor.size();
                            let new_x = new_x.max(0.0).min(monitor_size.width as f64 - window_width);
                            let new_y = new_y.max(0.0).min(monitor_size.height as f64 - window_height);

                            window
                                .set_position(PhysicalPosition::new(new_x, new_y))
                                .unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        } else {
                            window.hide().unwrap();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
