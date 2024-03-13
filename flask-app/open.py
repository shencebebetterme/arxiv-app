# open the paper locally using the default pdf reader

from pathlib import Path
import json
import sqlite3
import os

old_style_pdf_dir = Path("E:\\arxivData\\arxiv-dataset\\arxiv")
new_style_pdf_dir = Path("E:\\arxivData\\arxiv-dataset\\arxiv\\arxiv\\pdf")

database_dir = Path("D:\\arxivMetadata\\arxiv_papers.db")
conn = sqlite3.connect(database_dir, check_same_thread=False)
cursor = conn.cursor()

def get_version(id: str):
    """
    Parse the versions string to get the latest version number.
    versions is like [{"version": "v1", "created": "Mon, 2 Apr 2007 19:18:42 GMT"}, {"version": "v2", "created": "Tue, 24 Jul 2007 20:10:27 GMT"}]
    """
    query = f"SELECT id, versions FROM papers WHERE id = '{id}'"
    cursor.execute(query)
    arxiv_paper = cursor.fetchall()[0] # only one result
    versions = arxiv_paper[1] # id, version is returned as a tuple

    versions_json = json.loads(versions)
    latest_version = versions_json[-1]["version"]
    return latest_version

def open_pdf(id):
    """
    Open the paper in the browser.
    """
    print(f"Opening paper {id}")
    version = get_version(id)
    pdf_path = None

    if "/" in id:
        category, index = id.split("/")
        ym = index[:4]
        dir = old_style_pdf_dir / category / "pdf" / ym
        pdf_path = dir / f"{index}{version}.pdf"
    elif "." in id:
        ym, _ = id.split(".")
        ym_dir = new_style_pdf_dir / ym
        pdf_path = ym_dir / f"{id}{version}.pdf"
    else:
        raise Exception(f"Invalid id {id}")
    
    # check if the file exists
    if not pdf_path.exists():
        print(f"File {pdf_path} does not exist.")
        return 1
    
    # open the file using the default pdf reader
    os.system(f"start {pdf_path}")

    print(f"Opening {pdf_path}")
    return 0