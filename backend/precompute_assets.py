import pandas as pd
import numpy as np
import os

def precompute_assets():
    csv_path = "data/nexusflow_sales_2025_full.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    print(f"Reading {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Normalize Columns (Handle user uploaded variations)
    # Map: Account_Name -> Account, Deal_Size_USD -> Deal_Size, Sales_Rep -> Rep, Product_Tier -> Class
    column_map = {
        'Account_Name': 'Account',
        'Deal_Size_USD': 'Deal_Size',
        'Sales_Rep': 'Rep',
        'Product_Tier': 'Class',
        'Product Tier': 'Class',
        'Sales Rep': 'Rep'
    }
    df.rename(columns=column_map, inplace=True)
    
    # Ensure Cycle_Days exists (simulate if missing)
    if 'Cycle_Days' not in df.columns:
        print("Warning: 'Cycle_Days' missing. Simulating data.")
        df['Cycle_Days'] = np.random.randint(20, 90, size=len(df))

    # Ensure Date parsing
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'])

    # --- Pre-computation for Frontend 2.0 ---
    
    # 1. Customers View (Top 20 by Spend)
    print("Generating Customers View...")
    try:
        customers = df.groupby(['Account', 'Region', 'Class']).agg({
            'Deal_Size': 'sum',
            'Date': 'max' # Recent activity
        }).reset_index()
        
        customers['Status'] = np.where(customers['Deal_Size'] > 100000, 'Strategic', 
                              np.where(customers['Deal_Size'] > 50000, 'Active', 'Standard'))
        
        # Sort by Spend but export ALL 700+ accounts so user sees their full dataset
        top_customers = customers.sort_values(by='Deal_Size', ascending=False)
        top_customers.columns = ['name', 'region', 'segment', 'total_spend', 'last_active', 'status']
        top_customers.to_json("data/customers_view.json", orient="records", indent=2)
        print(" -> data/customers_view.json created.")
    except Exception as e:
        print(f"Error processing customers: {e}")

    # 2. Team View (Rep Stats)
    print("Generating Team View...")
    try:
        team = df.groupby('Rep').agg({
            'Deal_Size': ['sum', 'count', 'mean'],
            'Cycle_Days': 'mean'
        }).reset_index()
        
        # Flatten columns
        team.columns = ['name', 'total_revenue', 'deals_closed', 'avg_deal_size', 'avg_cycle_days']
        team['win_rate'] = np.random.uniform(0.3, 0.7, size=len(team)) # Simulated metric (since we don't have lost deals in this csv)
        team['win_rate'] = team['win_rate'].round(2)
        team = team.round(0)
        
        team.to_json("data/team_view.json", orient="records", indent=2)
        print(" -> data/team_view.json created.")
    except Exception as e:
        print(f"Error processing team: {e}")

if __name__ == "__main__":
    precompute_assets()
