use tauri::Manager; // For get_webview_window
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri::PhysicalPosition; // For setting window position
use std::sync::{Arc, Mutex}; // For debouncing clicks
use std::time::Instant;

pub fn run() {
    // Use a mutex to track the last click time for debouncing
    let last_click = Arc::new(Mutex::new(None::<std::time::Instant>));
    let last_click_clone = last_click.clone();

    let last_toggle = Arc::new(Mutex::new(Instant::now() - std::time::Duration::from_secs(1)));
    let last_toggle_clone = last_toggle.clone();

    tauri::Builder::default()
        .setup(|app| {
            // Hide the window on startup
            let window = app.get_webview_window("main").unwrap();
            window.hide().unwrap();

            let all_monitors = window.available_monitors().unwrap();
            println!("Monitors: {:?}", all_monitors);

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("My App")
                .on_tray_icon_event(move |tray, event| {
                    let app = tray.app_handle();
                    // Log detalhado do evento
                    println!("Tray event: {:?}", event);
                    if let TrayIconEvent::Click { position, button, .. } = event {
                        println!("Tray Click: button={:?}, position={:?}", button, position);
                        if button != tauri::tray::MouseButton::Left {
                            return;
                        }
                        let now = Instant::now();
                        let mut last = last_toggle_clone.lock().unwrap();
                        if now.duration_since(*last) < std::time::Duration::from_millis(300) {
                            // Ignora eventos duplicados rápidos
                            return;
                        }
                        *last = now;
                        let window = app.get_webview_window("main").unwrap();
                        let is_visible = window.is_visible().unwrap_or(false);
                        if !is_visible {
                            let tray_x = position.x;
                            let tray_y = position.y;
                            let win_size = window.outer_size().unwrap();
                            let win_width = win_size.width as f64;
                            let win_height = win_size.height as f64;
                            let new_x = tray_x - win_width / 2.0;
                            let new_y = tray_y + 8.0;

                            // Se houver monitor, limita para não sair da tela; senão, usa a posição mesmo assim
                            let (final_x, final_y) = if let Some(monitor) = window.monitor_from_point(tray_x, tray_y).ok().flatten() {
                                let m_pos = monitor.position();
                                let m_size = monitor.size();
                                let min_x = m_pos.x as f64;
                                let min_y = m_pos.y as f64;
                                let max_x = min_x + m_size.width as f64 - win_width;
                                let max_y = min_y + m_size.height as f64 - win_height;
                                (
                                    new_x.max(min_x).min(max_x),
                                    new_y.max(min_y).min(max_y)
                                )
                            } else {
                                (new_x, new_y)
                            };

                            window.set_position(PhysicalPosition::new(final_x, final_y)).unwrap();
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
