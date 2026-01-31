import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_csv():
    # Setup
    np.random.seed(42)
    regions = ["APAC", "NorthAm", "EMEA"]
    segments = ["Enterprise", "Professional", "SMB"]
    
    data = []
    
    # Generate 1000 rows
    start_date = datetime(2025, 1, 1)
    
    for i in range(1000):
        date_offset = np.random.randint(0, 365)
        date = start_date + timedelta(days=date_offset)
        
        region = np.random.choice(regions)
        segment = np.random.choice(segments)
        
        base_deal = 10000
        if segment == "Enterprise": base_deal = 50000
        if segment == "SMB": base_deal = 5000
        
        deal_size = int(np.random.normal(base_deal, base_deal * 0.2))
        cycle_days = int(np.random.normal(45, 10))
        
        # Inject Signal 1: APAC Enterprise Revenue Drop Post-Nov 15
        if region == "APAC" and segment == "Enterprise" and date > datetime(2025, 11, 15):
             deal_size = int(deal_size * 0.6) # Drop by ~40%
        
        # Inject Signal 2: EMEA Professional Growth Post-July
        if region == "EMEA" and segment == "Professional" and date > datetime(2025, 7, 1):
             deal_size = int(deal_size * 2.4) # Growth by ~140%
             
        # Inject Signal 3: NorthAm Cycle Friction
        if region == "NorthAm" and date.month >= 10: # Q4
             cycle_days += 15
             
        data.append({
            "Date": date.strftime("%Y-%m-%d"),
            "Region": region,
            "Class": segment,
            "Account": f"Account_{i}",
            "Deal_Size": max(0, deal_size),
            "Rep": f"Rep_{np.random.randint(1, 20)}",
            "Cycle_Days": cycle_days
        })
        
    df = pd.DataFrame(data)
    df.to_csv("data/nexusflow_sales_2025_full.csv", index=False)
    print("CSV Generated.")

    # --- Pre-computation for Frontend 2.0 ---
    
    # 1. Customers View (Top 20 by Spend)
    customers = df.groupby(['Account', 'Region', 'Class']).agg({
        'Deal_Size': 'sum',
        'Date': 'max' # Recent activity
    }).reset_index()
    
    customers['Status'] = np.where(customers['Deal_Size'] > 100000, 'Strategic', 
                          np.where(customers['Deal_Size'] > 50000, 'Active', 'Standard'))
    
    top_customers = customers.sort_values(by='Deal_Size', ascending=False).head(20)
    top_customers.columns = ['name', 'region', 'segment', 'total_spend', 'last_active', 'status']
    top_customers.to_json("data/customers_view.json", orient="records", indent=2)
    print("Customers JSON Generated.")

    # 2. Team View (Rep Stats)
    team = df.groupby('Rep').agg({
        'Deal_Size': ['sum', 'count', 'mean'],
        'Cycle_Days': 'mean'
    }).reset_index()
    
    # Flatten columns
    team.columns = ['name', 'total_revenue', 'deals_closed', 'avg_deal_size', 'avg_cycle_days']
    team['win_rate'] = np.random.uniform(0.3, 0.7, size=len(team)) # Simulated metric
    team['win_rate'] = team['win_rate'].round(2)
    team = team.round(0)
    
    team.to_json("data/team_view.json", orient="records", indent=2)
    print("Team JSON Generated.")

if __name__ == "__main__":
    generate_csv()
