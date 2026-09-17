#!/usr/bin/env python3
"""Extract US English iPhone artwork from Apple's public storefront HTML."""

import json
import sys
from html.parser import HTMLParser
from urllib.parse import urlparse


class StoreDataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_data = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.in_data = dict(attrs).get("id") == "serialized-server-data"

    def handle_data(self, data):
        if self.in_data:
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_data = False


def artwork_url(artwork, width, height, extension):
    url = artwork["template"].format(w=width, h=height, c="bb", f=extension)
    parsed = urlparse(url)
    if parsed.scheme != "https" or not (parsed.hostname or "").endswith(".mzstatic.com"):
        raise ValueError("Unexpected artwork host")
    return url


def extract(html, app_id):
    parser = StoreDataParser()
    parser.feed(html)
    payload = json.loads("".join(parser.parts))
    page = next(entry["data"] for entry in payload["data"]
                if str(entry.get("data", {}).get("lockup", {}).get("adamId")) == app_id)
    destination = page["lockup"]["clickAction"]["destination"]
    if destination.get("storefront") != "us" or destination.get("language") != "en-US":
        raise ValueError("Expected the US English storefront")
    screenshots = [item["screenshot"] for item in
                   page["shelfMapping"]["product_media_phone_"]["items"]
                   if item.get("screenshot")]
    if not screenshots:
        raise ValueError("No US English iPhone screenshots found")
    return {
        "icon": artwork_url(page["lockup"]["icon"], 512, 512, "png"),
        "screenshots": [artwork_url(shot, shot["width"], shot["height"], "jpg")
                        for shot in screenshots],
    }


if __name__ == "__main__":
    try:
        print(json.dumps(extract(sys.stdin.read(), sys.argv[1])))
    except (KeyError, ValueError, StopIteration) as error:
        sys.exit(f"Cannot read US storefront artwork; import stopped: {error}")
