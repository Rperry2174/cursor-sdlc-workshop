#!/usr/bin/env python3
"""Render rectangular SUCCESS / FAILURE stamps (BM Germar on black, colored border)."""

from __future__ import annotations

import os
import sys

# Allow running without global Pillow install
_HERE = os.path.dirname(os.path.abspath(__file__))
_DEPS = os.path.join(_HERE, "pip_deps")
if os.path.isdir(_DEPS):
    sys.path.insert(0, _DEPS)

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = os.path.join(_HERE, "fonts", "BM_germar", "BMgermar.TTF")
SUCCESS_HEX = "#596f2a"
FAILURE_HEX = "#67221f"


def _hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def render_stamp(
    out_path: str,
    label: str,
    color_hex: str,
    width: int = 600,
    height: int = 220,
    border_px: int = 44,
    font_size: int = 120,
) -> None:
    rgb = _hex_rgb(color_hex)
    img = Image.new("RGB", (width, height), rgb)
    draw = ImageDraw.Draw(img)
    inner = (border_px, border_px, width - border_px - 1, height - border_px - 1)
    draw.rectangle(inner, fill=(0, 0, 0))

    font = ImageFont.truetype(FONT_PATH, size=font_size)
    bbox = draw.textbbox((0, 0), label, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    ix0, iy0, ix1, iy1 = inner
    inner_w, inner_h = ix1 - ix0 + 1, iy1 - iy0 + 1
    tx = ix0 + (inner_w - tw) // 2 - bbox[0]
    ty = iy0 + (inner_h - th) // 2 - bbox[1]
    draw.text((tx, ty), label, font=font, fill=rgb)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    print(f"Wrote {out_path} ({width}x{height})")


def main() -> None:
    root = os.path.join(_HERE, "..", "public", "stamps")
    render_stamp(os.path.join(root, "success.png"), "SUCCESS", SUCCESS_HEX)
    render_stamp(os.path.join(root, "failure.png"), "FAILURE", FAILURE_HEX)


if __name__ == "__main__":
    main()
