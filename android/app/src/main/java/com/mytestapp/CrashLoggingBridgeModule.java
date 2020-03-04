package com.mytestapp;

import android.provider.Telephony;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.sentry.core.Sentry;
import io.sentry.core.SentryEvent;
import io.sentry.core.SentryLevel;
import io.sentry.core.protocol.Message;
import io.sentry.core.protocol.SentryException;
import io.sentry.core.protocol.SentryStackFrame;
import io.sentry.core.protocol.SentryStackTrace;

public class CrashLoggingBridgeModule extends ReactContextBaseJavaModule {

    public CrashLoggingBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "CrashLoggingBridge";
    }

    @ReactMethod
    public void logCrash(String json) {

        try {
            JSONObject jsonObject = new JSONObject(json);
            JSONArray errorStack = jsonObject.getJSONArray("errorStack");

            SentryException ex = new SentryException();
            ex.setStacktrace(this.parseStackTrace(errorStack));
            ex.setType("js");

            Message message = new Message();
            message.setMessage("React Native Error");

            SentryEvent event = new SentryEvent();
            event.setMessage(message);
            event.setPlatform("javascript");
            event.setLevel(SentryLevel.FATAL);
            event.setThreads(Arrays.asList());
            event.setExceptions(Arrays.asList(ex));
            Sentry.captureEvent(event);
        }
        catch (Exception ex) {
            Sentry.captureException(ex);
        }

        Sentry.captureMessage("logged crash: " + json.length());
    }

    private SentryStackTrace parseStackTrace(JSONArray stackTrace) throws JSONException {
        Log.d("sentry", stackTrace.toString(4));

        List<SentryStackFrame> frames = new ArrayList<SentryStackFrame>();

        for (int i = 0; i < stackTrace.length(); i++) {
            JSONObject jsonFrame = stackTrace.getJSONObject(i);
            String functionName = jsonFrame.getString("functionName");
            String fileName = jsonFrame.getString("fileName");
            String lineNumberString = jsonFrame.getString("lineNumber");
            String columnNumberString = jsonFrame.getString("columnNumber");

            SentryStackFrame frame = new SentryStackFrame();
            frame.setNative(false);
            frame.setFunction(functionName);
            frame.setLineno(Integer.valueOf(lineNumberString));
            frame.setColno(Integer.valueOf(columnNumberString));
            frame.setFilename(fileName);

            frames.add(frame);
        }

        return new SentryStackTrace(frames);
    }
}
