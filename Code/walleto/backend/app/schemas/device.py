from pydantic import BaseModel
from datetime import datetime


class DeviceTrustRequest(BaseModel):
    """Schema for device trust request."""
    device_token: str


class TrustedDeviceResponse(BaseModel):
    """Schema for trusted device response."""
    device_token: str
    expires_at: datetime
    message: str
