import sys
import json

# print(sys.argv)

if len(sys.argv) != 2:
    print('Err: 1 argument required (target filename)')
    exit()
else:
    print(sys.argv[1])

f = open(sys.argv[1], 'r')
# print(f.read())

obj = {}

def parseLineIntoObj(line):
    for i in range(0, len(line)):
        if line[i] == ' ':
            spaceIndex = i
            break
    # print(line[1:spaceIndex])
    # print('-')
    # print(line[(spaceIndex + 2):len(line) - 3])
    obj[line[1:spaceIndex]] = line[(spaceIndex + 2):len(line) - 3]

pgnContent = ''
for line in f:
    if line[0] == '[':
        # print(line)
        parseLineIntoObj(line)
    else:
        pgnContent += line

obj['pgnContent'] = pgnContent

with open("sample.json", "w") as outfile:  
    json.dump(obj, outfile)

print('details')
print(obj)

print('PGN')
print(pgnContent)


# for arg in sys.argv:


# print('parse!')

