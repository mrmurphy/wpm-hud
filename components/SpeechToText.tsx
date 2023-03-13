import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Voice from "@react-native-voice/voice";

const SpeechToText = () => {
  const [startTime, setStartTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [error, setError] = useState("");
  const [wpm, setWpm] = useState(0);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (event: any) => {
    setSpokenText(event.value[0]);
  };

  const onSpeechError = (event: any) => {
    setIsListening(false);
    setError(event.error.message);
  };

  const startListening = async () => {
    setStartTime(Date.now());
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (Date.now() - startTime < 1000) {
      setWpm(0);
      return;
    }
    if (spokenText) {
      const words = spokenText.split(" ").length;
      const minutes = (Date.now() - startTime) / 1000 / 60;
      const wpm = Math.round(words / minutes);
      setWpm(wpm);
    }
  }, [spokenText, startTime]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHalf}>
        <View
          style={[
            styles.transcriptContainer,
            !spokenText && styles.transcriptContainerEmpty,
          ]}
        >
          {spokenText == "" && (
            <Text style={styles.placeholderText}>
              Text will appear here when you start speaking
            </Text>
          )}
          <Text style={styles.transcriptText}>
            {spokenText.slice(-900, spokenText.length)}
          </Text>
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <Text style={styles.wmpLabel}>WPM</Text>
        <Text style={styles.wmpNumber}>{wpm}</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isListening && styles.buttonActive]}
          onPress={toggleListening}
        >
          <Text style={styles.buttonText}>
            {isListening ? "Stop Listening" : "Start Listening"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SpeechToText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#1a1a1a",
  },
  topHalf: {
    width: "100%",
    flex: 1,
    padding: 24,
  },
  transcriptContainer: {
    // Just a little lighter than the background color
    backgroundColor: "#2a2a2a",
    borderRadius: 18,
    padding: 24,
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-end",
    overflow: "hidden",
  },
  transcriptContainerEmpty: {
    justifyContent: "center",
    alignContent: "center",
  },
  transcriptText: {
    fontSize: 20,
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    // Not bright white, but enough contrast to be readable
    color: "#e6e6e6",
    textAlign: "left",
  },
  bottomHalf: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    textAlign: "center",
    // an inactive, placeholder gray
    color: "#808080",
    fontSize: 18,
  },
  wmpLabel: {
    fontSize: 40,
    color: "#fff",
  },
  wmpNumber: {
    fontSize: 80,
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    backgroundColor: "#12c1d9",
    padding: 20,
    borderRadius: 100,
    marginTop: 20,
  },
  buttonActive: {
    // A soft red to show that recording is active
    backgroundColor: "#ff7f7f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  controls: {
    width: "100%",
    padding: 24,
  },
  errorText: {
    // A nice soft red color
    color: "#ff7f7f",
    fontSize: 20,
  },
});
