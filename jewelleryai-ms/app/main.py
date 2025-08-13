from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from app.image_process import process_jewelry_image

app = FastAPI()

@app.get("/data")
def get_jewelry_data(image_url: str = Query(..., description="URL of the jewelry image")):
    try:
        result = process_jewelry_image(image_url)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
