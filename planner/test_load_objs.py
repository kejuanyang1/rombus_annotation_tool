import pandas as pd
import json

csv_path = "/Users/ykj/Downloads/_ROMBUS dataset - Object Set (5.13).csv"
df = pd.read_csv(csv_path)
result = []
for _, row in df.iterrows():
    raw_cat = row['Category'].lower()
    if 'lid' in raw_cat:
        cat = 'lid'
    elif 'container' in raw_cat:
        cat = 'container'
    # elif row['Support'] == 'yes':
    #     cat = 'support'
    else:
        cat = 'item'
    entry = {
        'id': row['Object_id'],
        'name': row['Object_name'].strip(),
        'category': cat,
        'quantity': int(row['Quantity'])
    }
    result.append(entry)

print(result)
save_file = "/Users/ykj/Desktop/github/ROMBUS/assets/objects.json"
with open(save_file, 'w') as f:
    json.dump(result, f)
