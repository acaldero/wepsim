
#
# Import
#

from fastapi      import FastAPI
from pydantic     import BaseModel
from urllib.parse import urlparse

import uvicorn
import subprocess, requests
import tempfile
import os


#
# Auxiliar functions
#

def wepsim_helper(cmd_options: list[str]) -> tuple[int, str]:
    # Run the associated command
    result = subprocess.run(
        ['../ws_dist/wepsim.sh', *cmd_options],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    # Return status and output
    return result.returncode, result.stdout

def is_valid_url(url):
    # Code from https://www.slingacademy.com/article/python-ways-to-check-if-a-string-is-a-valid-url/
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

def ws_save2file(filename:str, value: str) -> bool:
    try:
       # Firm as url...
       if is_valid_url(value):
          response = requests.get(value)
          with open(filename, 'wb') as file:
               file.write(response.content)
          return response.ok

       # Firm as text...
       with open(filename, 'w') as file:
            file.write(value)
       return True
    except Exception as error:
       print(f"ERROR: {error}")
       return False

def wepsim_action(action: str, model: str, firm: str, asm: str) -> tuple[int, str]:
    with tempfile.TemporaryDirectory() as tmpdir:
         # Options
         fname_firm = os.path.join(tmpdir, 'firm.mc')
         fname_asm  = os.path.join(tmpdir, 'app.asm')

         # Save firmware on file
         if not ws_save2file(fname_firm, firm):
            return -1, "firmware file cannot be written"

         # Save assembly on file
         if not ws_save2file(fname_asm, asm):
            return -1, "assembly file cannot be written"

         # Command arguments
         cmd_options = [
            "-a", action,
            "-m", model,
            "-f", fname_firm,
            "-s", fname_asm
         ]

         # Return action on files
         return wepsim_helper(cmd_options)


#
# Definition of the "api" object
#

## Initialize FastAPI
api = FastAPI()

## Get status as API REST (1: ok)
@api.get("/api/status")
def rest_status():
    return { "status": 1 }

class Item(BaseModel):
    action:   str
    model:    str
    firmware: str
    assembly: str

## Post action as REST API (-1: error)
@api.post("/api/action/")
def rest_action(item: Item):
    # Options
    fname_firm  = '/tmp/firm.mc'
    fname_asm   = '/tmp/app.asm'
    cmd_options = " -a " + item.action + " -m " + item.model + " -f " + fname_firm + " -s " + fname_asm

    # Save firmware on file
    ret = ws_save2file(fname_firm, item.firmware)
    if (False == ret):
        return -1, "firmware file cannot be written"

    # Save assembly on file
    ret = ws_save2file(fname_asm, item.assembly)
    if (False == ret):
        return -1, "assembly file cannot be written"

    # Return action on files
    status, output = wepsim_helper(cmd_options)
    return { "status": status, "output": output }


##
## Main
##

if __name__ == "__main__":
    uvicorn.run(api, host="127.0.0.1", port=8008)

