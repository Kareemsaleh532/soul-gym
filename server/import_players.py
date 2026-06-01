import os
import sqlite3
import pandas as pd
from datetime import datetime, timedelta

db_path = r"c:\Users\97056\Desktop\soul-gym\server\soulgym.db"
desktop = r"C:\Users\97056\Desktop"

# Find the Excel file dynamically
excel_path = None
for f in os.listdir(desktop):
    if f.endswith(".xlsx") and not f.startswith("~$") and "Assignment" not in f and "Microsoft Excel" not in f:
        excel_path = os.path.join(desktop, f)
        print(f"Dynamically detected Excel file: {f}")
        break

if not excel_path:
    # fallback to any non-temp xlsx file that isn't the student assignment one
    for f in os.listdir(desktop):
        if f.endswith(".xlsx") and not f.startswith("~$") and "performance" not in f:
            excel_path = os.path.join(desktop, f)
            print(f"Fallback detected Excel file: {f}")
            break

print("Starting import process...")

# 1. Back up existing records
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("SELECT name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in FROM members")
    existing_members = cursor.fetchall()
    print(f"Backed up {len(existing_members)} existing members.")
except sqlite3.OperationalError as e:
    print("No existing members found or table doesn't exist yet:", e)
    existing_members = []

# 2. Drop the existing table to migrate
cursor.execute("DROP TABLE IF EXISTS members")
conn.commit()
print("Dropped old members table.")

# 3. Create table with the new schema (optional phone)
cursor.execute("""
    CREATE TABLE members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        avatar TEXT,
        plan_type TEXT NOT NULL,
        subscription_start DATETIME DEFAULT CURRENT_TIMESTAMP,
        subscription_end DATETIME NOT NULL,
        last_check_in TEXT
    )
""")
conn.commit()
print("Created new members table with optional phone.")

# 4. Restore existing members
for member in existing_members:
    cursor.execute("""
        INSERT INTO members (name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, member)
conn.commit()
print(f"Restored {len(existing_members)} members to the new schema.")

# 5. Read the Excel file and import new players
if excel_path and os.path.exists(excel_path):
    print(f"Reading Excel file: {excel_path} ...")
    # Read sheet "ورقة1"
    df = pd.read_excel(excel_path, sheet_name="ورقة1")
    
    # Strip column names
    df.columns = [c.strip() if isinstance(c, str) else c for c in df.columns]
    
    now = datetime.now()
    subscription_end = now + timedelta(days=30)
    
    imported_count = 0
    for idx, row in df.iterrows():
        name_val = row.get("اسم الموظف")
        if pd.isna(name_val):
            continue
        name = str(name_val).strip()
        
        # Check if already exists to prevent duplicate insertion
        cursor.execute("SELECT COUNT(*) FROM members WHERE name = ?", (name,))
        if cursor.fetchone()[0] > 0:
            print(f"Member '{name}' already exists. Skipping.")
            continue
        
        # Determine plan type based on Basic Salary (الراتب الاساسي)
        salary_val = row.get("الراتب الاساسي")
        try:
            salary = float(salary_val) if not pd.isna(salary_val) else 0.0
        except ValueError:
            salary = 0.0
            
        if salary >= 900:
            plan_type = "Elite Training"
        elif salary >= 700:
            plan_type = "Pro Membership"
        else:
            plan_type = "Basic Plan"
            
        avatar = f"https://i.pravatar.cc/150?u={name}"
        
        cursor.execute("""
            INSERT INTO members (name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (name, None, avatar, plan_type, now.isoformat(), subscription_end.isoformat(), "Never"))
        imported_count += 1
        print(f"Imported '{name}' with plan '{plan_type}' (based on salary {salary}).")
        
    conn.commit()
    print(f"Successfully imported {imported_count} new players from Excel!")
else:
    print(f"Excel file not found or couldn't be detected.")

conn.close()
print("Database operations complete.")
