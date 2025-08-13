from transformers import pipeline
from PIL import Image
import requests

# Initialize zero-shot image classification pipeline using CLIP for jewelry category
classifier = pipeline("zero-shot-image-classification", model="openai/clip-vit-large-patch14")

# Initialize image captioning pipeline using Salesforce BLIP large model for better jewelry captions
captioner = pipeline("image-to-text", model="Salesforce/blip-image-captioning-large")

def load_image_from_url(image_url):
    response = requests.get(image_url, stream=True)
    return Image.open(response.raw).convert("RGB")

def classify_jewelry_zero_shot(image_url):
    image = load_image_from_url(image_url)
    candidate_labels = [
        "bangles", "gold ring", "diamond ring", "necklace", "bracelet",
        "earrings", "watch", "pendant", "chain"
    ]
    result = classifier(image, candidate_labels)
    top_label = result[0]['label']
    top_score = result[0]['score']
    return top_label, top_score

def truncate_title_to_space(title, max_length):
    if len(title) <= max_length:
        return title
    truncated = title[:max_length]
    last_space = truncated.rfind(' ')
    if last_space == -1:
        # No space found, just return truncated string
        return truncated
    return truncated[:last_space]

def generate_title_and_summary(image_url, min_length=100, max_title_length=30):
    image = load_image_from_url(image_url)
    results = captioner(image)
    summary = results[0]['generated_text']

    # Ensure minimum length for summary by repeating if necessary
    if len(summary) < min_length:
        summary = (summary + " ") * ((min_length // len(summary)) )
        summary = summary[:min_length].strip()

    # Title as first sentence or first 60 chars if no period
    title = truncate_title_to_space(summary.split('.')[0], max_title_length)
    return title, summary

def process_jewelry_image(image_url):
    category, confidence = classify_jewelry_zero_shot(image_url)
    title, summary = generate_title_and_summary(image_url)

    return {
        "category": category,
        "accuracy": round(confidence * 100, 2),  # Convert to percentage
        "title": title,
        "summary": summary
    }

# Example usage
# if __name__ == "__main__":
#     image_url = "https://lh7-us.googleusercontent.com/18-UMH2EypsHUXNm5Z5yFe_BiBu76yKgaQNGpOO_w_9atZc6R1uwdG0imc51ueQTUwUCOJyG8Lqlbu--PeoUQGppYX16isumCocOR254QFo93e93K0B0NDykCH0ZBgqi38-ghvmaODzp2FKnF1P1rY4"
#    # image_url = "https://m.media-amazon.com/images/I/71pBJYZnkdL._UY1100_.jpg"
#     output = process_jewelry_image(image_url)
#     print(output)
