import re, json, sys
p=r"c:\Users\user\AppData\Local\Programs\Python\Python313\新しいフォルダー\Untitled-1.html"
with open(p, 'r', encoding='utf-8') as f:
    s = f.read()
m = re.search(r'externalSchedule\s*=\s*\[', s)
if not m:
    print('ERR: externalSchedule not found')
    sys.exit(2)
start = m.end()
end = s.find('];', start)
if end == -1:
    print('ERR: closing "];" not found')
    sys.exit(2)
arr = s[start:end]
json_text = '[' + arr + ']'
try:
    data = json.loads(json_text)
except Exception as e:
    print('ERR: JSON parse error:\n', e)
    # show snippet around error location
    print('\n---snippet---\n', json_text[max(0,0):min(len(json_text),2000)])
    sys.exit(1)
print('OK: JSON valid')
print('count=', len(data))
if len(data):
    print('first=', data[0].get('列車'), data[0].get('発車時刻'))
    print('last=', data[-1].get('列車'), data[-1].get('発車時刻'))
