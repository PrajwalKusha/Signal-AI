import json
import random

# Load the transformation backlog
with open('data/transformation_backlog.json', 'r') as f:
    backlog = json.load(f)

# Define realistic employee names by department
employees = {
    "Sales": [
        "Sarah Chen, Director of Sales Ops",
        "Michael Torres, VP of Sales",
        "Jennifer Park, Sales Strategy Lead"
    ],
    "Legal": [
        "Marcus Thorne, Legal Tech Lead",
        "Diana Reeves, Chief Legal Officer",
        "Robert Kim, Compliance Manager"
    ],
    "Marketing": [
        "Jessica Wu, EMEA Growth Head",
        "Alex Rivera, CMO",
        "Priya Sharma, Marketing Analytics Lead"
    ],
    "Engineering": [
        "David Chen, VP of Engineering",
        "Emily Zhang, Principal Engineer",
        "James Wilson, DevOps Lead"
    ],
    "Operations": [
        "Lisa Anderson, COO",
        "Kevin Martinez, Operations Director",
        "Rachel Thompson, Process Optimization Lead"
    ],
    "HR": [
        "Amanda Foster, CHRO",
        "Brian Lee, Talent Acquisition Lead",
        "Sophia Rodriguez, HR Tech Manager"
    ]
}

# Add author field to items that don't have it
for item in backlog:
    if 'author' not in item or not item['author']:
        dept = item.get('dept', 'Operations')
        # Get appropriate employee list for the department
        dept_employees = employees.get(dept, employees['Operations'])
        # Assign a random employee from that department
        item['author'] = random.choice(dept_employees)

# Save the updated backlog
with open('data/transformation_backlog.json', 'w') as f:
    json.dump(backlog, f, indent=4)

print(f"✅ Updated {len(backlog)} transformation items with author attribution")
print(f"Sample: {backlog[0]['id']} - {backlog[0]['author']}")
