import subprocess
import sys
import os
from datetime import datetime, timedelta

def commit_in_past(folder_name, date, message):
    """
    Create a Git commit for a folder with a specified past date.

    :param folder_name: Folder name to commit
    :param date: Commit date in ISO 8601 format (e.g., "2023-01-01T12:00:00")
    """
    try:
        # Stage all changes in the folder
        subprocess.run(["git", "add", folder_name], check=True)

        # Commit with a past date
        subprocess.run(
            ["git", "commit", "-m", f"Created {message}", "--date", date],
            check=True
        )
        print(f"Commit created for folder: '{folder_name}' with date: '{date}'")
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python commit_in_past.py <root_folder>")
        sys.exit(1)

    root_folder = sys.argv[1]
    message = sys.argv[2]
    start_date = datetime(2025, 1, 18)

    if not os.path.isdir(root_folder):
        print(f"Error: '{root_folder}' is not a valid directory.")
        sys.exit(1)

    # Iterate through folders in the root directory
    for index, folder in enumerate(sorted(os.listdir(root_folder))):
        folder_path = os.path.join(root_folder, folder)
        if os.path.isdir(folder_path):
            commit_date = (start_date + timedelta(days=index * 3)).isoformat()
            commit_in_past(folder, commit_date, message)

    # Push changes to the remote repository
    # try:
    #     subprocess.run(["git", "push"], check=True)
    #     print("All changes pushed to the remote repository.")
    # except subprocess.CalledProcessError as e:
    #     print(f"Error during push: {e}")
    #     sys.exit(1)
