import os
import sqlite3
import pandas as pd
from datetime import datetime, timedelta

db_path = r"c:\Users\97056\Desktop\soul-gym\server\soulgym.db"
excel_path = r"c:\Users\97056\Downloads\SOULGYM 08.xlsx"

print("Starting bulk import process for SOULGYM 08...")

# 1. Connect to SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 2. Reset (Clean) the members table completely
cursor.execute("DELETE FROM members")
conn.commit()
print("Cleaned all existing members from the database.")

# 3. Read the Excel file
if os.path.exists(excel_path):
    print(f"Reading Excel file: {excel_path} ...")
    # Read sheet "membership"
    df = pd.read_excel(excel_path, sheet_name="membership")
    
    # Strip column names
    df.columns = [c.strip() if isinstance(c, str) else c for c in df.columns]
    
    imported_count = 0
    skipped_count = 0
    
    # Process each row
    for idx, row in df.iterrows():
        name_val = row.get("Names")
        if pd.isna(name_val):
            skipped_count += 1
            continue
            
        name = str(name_val).strip()
        if not name or name.lower() in ["nan", "none"]:
            skipped_count += 1
            continue
            
        # Parse Dates safely
        date_paid_val = row.get("Date Paid")
        expiration_val = row.get("Expiration")
        
        # 1. Parse Subscription Start
        try:
            if pd.isna(date_paid_val) or str(date_paid_val).strip() in ["NaT", "nan", "None"]:
                sub_start = datetime.now()
            else:
                sub_start = pd.to_datetime(date_paid_val)
                if pd.isna(sub_start):
                    sub_start = datetime.now()
        except Exception:
            sub_start = datetime.now()
            
        # 2. Parse Subscription End
        try:
            if pd.isna(expiration_val) or str(expiration_val).strip() in ["NaT", "nan", "None"]:
                sub_end = sub_start + timedelta(days=30)
            else:
                sub_end = pd.to_datetime(expiration_val)
                if pd.isna(sub_end):
                    sub_end = sub_start + timedelta(days=30)
        except Exception:
            sub_end = sub_start + timedelta(days=30)
            
        # 3. Determine Plan Type based on Amount safely
        amount_val = row.get("Amount")
        amount = 0.0
        if not pd.isna(amount_val):
            try:
                if isinstance(amount_val, (int, float)):
                    amount = float(amount_val)
                elif isinstance(amount_val, str):
                    cleaned_amount = "".join(c for c in amount_val if c.isdigit() or c == '.')
                    amount = float(cleaned_amount) if cleaned_amount else 0.0
            except Exception:
                amount = 0.0
            
        if amount >= 1000:
            plan_type = "Elite Training"
        elif amount >= 400:
            plan_type = "Pro Membership"
        else:
            plan_type = "Basic Plan"
            
        avatar = f"https://i.pravatar.cc/150?u={name}"
        
        # Insert record
        cursor.execute("""
            INSERT INTO members (name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (name, None, avatar, plan_type, sub_start.isoformat(), sub_end.isoformat(), "Never"))
        imported_count += 1
        
    conn.commit()
    print(f"Successfully reset database and imported {imported_count} members!")
    print(f"Skipped {skipped_count} empty/invalid rows.")
else:
    print(f"Excel file not found at {excel_path}")

conn.close()
print("Bulk import complete.")
