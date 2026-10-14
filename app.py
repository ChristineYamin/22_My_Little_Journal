
import streamlit as st

import joblib
import json
from pathlib import Path


import pandas as pd
import matplotlib.pyplot as plt




# Page configuration
st.set_page_config(
    page_title="My Little Journal",
    page_icon="🌸",
    layout="centered"
)

# Locate saved model files
PROJECT_DIR = Path(__file__).resolve().parent
MODEL_DIR = PROJECT_DIR / "models" / "baseline"

@st.cache_resource
def load_model():
    model = joblib.load(MODEL_DIR / "logistic_regression.joblib")
    tfidf = joblib.load(MODEL_DIR / "tfidf_vectorizer.joblib")

    with open(MODEL_DIR / "metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)

    return model, tfidf, metadata


model, tfidf, metadata = load_model()




# App header
st.title("🌸 My Little Journal")
st.subheader("AI-Powered Emotion Analysis")

st.write(
    "Explore the emotions expressed in your writing "
    "using our multi-label emotion classification model."
)

st.divider()

# User input
journal_text = st.text_area(
    "How are you feeling today?",
    placeholder="Write something about your day...",
    height=150
)


# Analyze button
if st.button("🌷 Analyze My Emotions", use_container_width=True):

    if journal_text.strip():

        # Convert text into TF-IDF features
        text_features = tfidf.transform([journal_text])

        # Predict emotion probabilities
        probabilities = model.predict_proba(text_features)[0]

        # Get emotion names and classification threshold
        emotion_names = metadata["emotion_names"]
        threshold = metadata["threshold"]

        # Select emotions above the threshold
        predictions = [
            (emotion_names[i], float(prob))
            for i, prob in enumerate(probabilities)
            if prob >= threshold
        ]

        # Sort predictions by probability
        predictions.sort(key=lambda x: x[1], reverse=True)

        st.subheader("🌸 Your Emotion Analysis")

        if predictions:
            for emotion, probability in predictions:
                st.write(f"**{emotion.capitalize()}**")
                st.progress(probability)
                st.caption(f"Model score: {probability:.1%}")
            
            # Prepare chart data
            chart_df = pd.DataFrame(
                predictions,
                columns=["Emotion", "Probability"]
            )

            # Create horizontal bar chart
            fig, ax = plt.subplots(figsize=(8, 4))

            ax.barh(
                chart_df["Emotion"],
                chart_df["Probability"],
                color="#D68FA7"
            )

            ax.invert_yaxis()
            ax.set_xlim(0, 1)
            ax.set_xlabel("Predicted Probability")
            ax.set_title("Emotion Probability Distribution")

            plt.tight_layout()

            st.pyplot(fig)
            plt.close(fig)

        else:
            st.info(
                "No emotions exceeded the prediction threshold."
            )

    else:
        st.warning("Please write something first.")


st.divider()

st.caption(
    "Project 22 | My Little Journal | "
    "TF-IDF + Logistic Regression"
)
