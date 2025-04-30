use tauri::Manager; // For get_webview_window
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri::PhysicalPosition; // For setting window position
use std::sync::{Arc, Mutex}; // For debouncing clicks
use std::time::Instant;
use tokio::time::sleep;

pub fn run() {
    // Use a mutex to track the last click time for debouncing
    let last_click = Arc::new(Mutex::new(None::<std::time::Instant>));
    let last_click_clone = last_click.clone();

    let last_toggle = Arc::new(Mutex::new(Instant::now() - std::time::Duration::from_secs(1)));
    let last_toggle_clone = last_toggle.clone();
    let last_hide = Arc::new(Mutex::new(Instant::now() - std::time::Duration::from_secs(1)));
    let last_hide_clone = last_hide.clone();

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
                        if now.duration_since(*last) < std::time::Duration::from_millis(100) {
                            // Ignora eventos duplicados rápidos
                            return;
                        }
                        *last = now;
                        let window = app.get_webview_window("main").unwrap();
                        let is_visible = window.is_visible().unwrap_or(false);
                        if !is_visible {
                            // Se a janela foi fechada há menos de 100ms, aguarda 50ms antes de abrir
                            let last_hide_time = *last_hide_clone.lock().unwrap();
                            let since_hide = now.duration_since(last_hide_time);
                            if since_hide < std::time::Duration::from_millis(100) {
                                let window_ = window.clone();
                                let position = position.clone();
                                let win_size = window.outer_size().unwrap();
                                tauri::async_runtime::spawn(async move {
                                    sleep(std::time::Duration::from_millis(50)).await;
                                    let tray_x = position.x;
                                    let tray_y = position.y;
                                    let win_width = win_size.width as f64;
                                    let win_height = win_size.height as f64;
                                    let new_x = tray_x - win_width / 2.0;
                                    let new_y = tray_y + 8.0;
                                    let (final_x, final_y) = if let Some(monitor) = window_.monitor_from_point(tray_x, tray_y).ok().flatten() {
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
                                    window_.set_position(PhysicalPosition::new(final_x, final_y)).unwrap();
                                    window_.set_always_on_top(true).unwrap();
                                    window_.show().unwrap();
                                    window_.set_focus().unwrap();
                                    let window2 = window_.clone();
                                    tauri::async_runtime::spawn(async move {
                                        sleep(std::time::Duration::from_millis(300)).await;
                                        let _ = window2.set_always_on_top(false);
                                    });
                                });
                                return;
                            }
                            let tray_x = position.x;
                            let tray_y = position.y;
                            let win_size = window.outer_size().unwrap();
                            let win_width = win_size.width as f64;
                            let win_height = win_size.height as f64;
                            let new_x = tray_x - win_width / 2.0;
                            let new_y = tray_y + 8.0;
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
                            window.set_always_on_top(true).unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                            let window_ = window.clone();
                            tauri::async_runtime::spawn(async move {
                                sleep(std::time::Duration::from_millis(300)).await;
                                let _ = window_.set_always_on_top(false);
                            });
                        } else {
                            *last_hide_clone.lock().unwrap() = now;
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
