from user_agents import parse as ua_parse
from fastapi import Request
from typing import Optional


def parse_device_info(request: Request) -> dict:
    ua_string = request.headers.get("user-agent", "")
    ua = ua_parse(ua_string)

    if ua.is_mobile:
        device_type = "mobile"
    elif ua.is_tablet:
        device_type = "tablet"
    else:
        device_type = "desktop"

    return {
        "ip_address": get_client_ip(request),
        "device_type": device_type,
        "os_name": ua.os.family,
        "browser_name": ua.browser.family,
        "ip_location": None,
    }


def get_client_ip(request: Request) -> Optional[str]:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None
