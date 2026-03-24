import math
import struct
import zlib
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = PROJECT_ROOT / "icons"
SIZES = (16, 32, 48, 128)


def clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def mix(color_a, color_b, t: float):
    t = clamp(t)
    return tuple(int(round(lerp(color_a[index], color_b[index], t))) for index in range(4))


def alpha_over(base, overlay):
    overlay_alpha = overlay[3] / 255.0
    base_alpha = base[3] / 255.0
    out_alpha = overlay_alpha + base_alpha * (1 - overlay_alpha)

    if out_alpha <= 0:
        return 0, 0, 0, 0

    result = []

    for channel in range(3):
        value = (
            overlay[channel] * overlay_alpha + base[channel] * base_alpha * (1 - overlay_alpha)
        ) / out_alpha
        result.append(int(round(value)))

    result.append(int(round(out_alpha * 255)))
    return tuple(result)


def point_in_polygon(x: float, y: float, polygon):
    inside = False
    previous_index = len(polygon) - 1

    for index, (current_x, current_y) in enumerate(polygon):
        previous_x, previous_y = polygon[previous_index]
        intersects = ((current_y > y) != (previous_y > y)) and (
            x < (previous_x - current_x) * (y - current_y) / ((previous_y - current_y) or 1e-9) + current_x
        )

        if intersects:
            inside = not inside

        previous_index = index

    return inside


def distance_to_segment(px: float, py: float, ax: float, ay: float, bx: float, by: float) -> float:
    dx = bx - ax
    dy = by - ay
    length_squared = dx * dx + dy * dy

    if length_squared == 0:
        return math.hypot(px - ax, py - ay)

    position = ((px - ax) * dx + (py - ay) * dy) / length_squared
    position = clamp(position)
    closest_x = ax + position * dx
    closest_y = ay + position * dy
    return math.hypot(px - closest_x, py - closest_y)


def point_in_rounded_rect(x: float, y: float, left: float, top: float, right: float, bottom: float, radius: float) -> bool:
    if x < left or x > right or y < top or y > bottom:
        return False

    inner_left = left + radius
    inner_right = right - radius
    inner_top = top + radius
    inner_bottom = bottom - radius

    if inner_left <= x <= inner_right or inner_top <= y <= inner_bottom:
        return True

    corner_x = inner_left if x < inner_left else inner_right
    corner_y = inner_top if y < inner_top else inner_bottom
    return math.hypot(x - corner_x, y - corner_y) <= radius


def png_chunk(chunk_type: bytes, data: bytes) -> bytes:
    body = chunk_type + data
    return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)


def write_png(path: Path, size: int):
    background_top = (15, 23, 42, 255)
    background_bottom = (37, 99, 235, 255)
    glow_color = (103, 232, 249, 255)
    panel_fill = (15, 23, 42, 150)
    panel_stroke = (148, 163, 184, 48)
    prompt_color = (226, 232, 240, 255)
    pointer_color = (248, 250, 252, 255)

    outer_radius = 0.18
    panel = (0.16, 0.21, 0.67, 0.52, 0.10)
    caret_rect = (0.45, 0.25, 0.52, 0.45, 0.04)
    pointer_shadow = [(0.57, 0.52), (0.57, 0.88), (0.68, 0.78), (0.76, 0.95), (0.83, 0.91), (0.76, 0.75), (0.88, 0.75)]
    pointer = [(0.58, 0.49), (0.58, 0.87), (0.70, 0.75), (0.80, 0.94), (0.90, 0.89), (0.81, 0.70), (0.93, 0.70)]

    rows = []

    for pixel_y in range(size):
        row = bytearray([0])
        y = (pixel_y + 0.5) / size

        for pixel_x in range(size):
            x = (pixel_x + 0.5) / size
            color = (0, 0, 0, 0)

            if point_in_rounded_rect(x, y, 0.08, 0.08, 0.92, 0.92, outer_radius):
                color = mix(background_top, background_bottom, (x + y) * 0.55)
                glow_distance = math.hypot(x - 0.72, y - 0.26)
                if glow_distance < 0.42:
                    glow_strength = clamp(1 - glow_distance / 0.42) * 0.28
                    color = mix(color, glow_color, glow_strength)

                if point_in_rounded_rect(x, y, *panel):
                    color = alpha_over(color, panel_fill)
                    if not point_in_rounded_rect(
                        x,
                        y,
                        panel[0] + 0.015,
                        panel[1] + 0.015,
                        panel[2] - 0.015,
                        panel[3] - 0.015,
                        panel[4] - 0.015,
                    ):
                        color = alpha_over(color, panel_stroke)

                prompt_width = max(0.028, 1.15 / size)
                if (
                    distance_to_segment(x, y, 0.24, 0.29, 0.31, 0.36) <= prompt_width
                    or distance_to_segment(x, y, 0.24, 0.43, 0.31, 0.36) <= prompt_width
                ):
                    color = prompt_color

                if point_in_rounded_rect(x, y, *caret_rect):
                    color = glow_color

                if point_in_polygon(x, y, pointer_shadow):
                    color = alpha_over(color, (34, 211, 238, 76))

                if point_in_polygon(x, y, pointer):
                    color = pointer_color

            row.extend(color)

        rows.append(bytes(row))

    raw = b"".join(rows)
    data = zlib.compress(raw, level=9)
    header = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", header) + png_chunk(b"IDAT", data) + png_chunk(b"IEND", b"")
    path.write_bytes(png)


def main():
    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    for size in SIZES:
        write_png(ICONS_DIR / f"icon{size}.png", size)


if __name__ == "__main__":
    main()
