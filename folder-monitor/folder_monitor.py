from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import datetime
import os

FOLDER = "C:/CyberSecure_Workspace"
LOGFILE = "folder_log.txt"

class FolderActivityLogger(FileSystemEventHandler):
    def on_modified(self, event):
        self.log_event("Modified", event.src_path)

    def on_created(self, event):
        self.log_event("Created", event.src_path)

    def on_deleted(self, event):
        self.log_event("Deleted", event.src_path)

    def log_event(self, action, path):
        with open(LOGFILE, "a") as f:
            f.write(f"[{datetime.datetime.now()}] {action}: {path}\n")

if __name__ == "__main__":
    if not os.path.exists(FOLDER):
        print("❌ Folder not found. Make sure the secure folder is created first.")
        exit()

    observer = Observer()
    event_handler = FolderActivityLogger()
    observer.schedule(event_handler, FOLDER, recursive=True)
    observer.start()
    print(f"✅ Monitoring started on {FOLDER}...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
