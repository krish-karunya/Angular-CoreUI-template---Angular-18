import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Observable, Subject } from 'rxjs';

export interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class AudioRecordingService {
  private stream: MediaStream | null = null;
  private recorder: RecordRTC.StereoAudioRecorder | null = null;
  private intervalId: number | null = null;
  private startTime: number | null = null;

  private recordedSubject = new Subject<RecordedAudioOutput>();
  private recordingTimeSubject = new Subject<string>();
  private recordingFailedSubject = new Subject<string>();

  recorded$: Observable<RecordedAudioOutput> =
    this.recordedSubject.asObservable();

  recordingTime$: Observable<string> = this.recordingTimeSubject.asObservable();

  recordingFailed$: Observable<string> =
    this.recordingFailedSubject.asObservable();

  startRecording(): void {
    if (this.recorder) return;

    this.recordingTimeSubject.next('00:00');

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.stream = stream;
        this.record();
      })
      .catch(() => {
        this.recordingFailedSubject.next('Microphone permission denied');
      });
  }

  stopRecording(): void {
    if (!this.recorder) return;

    this.recorder.stop(
      (blob: Blob) => {
        const title = `audio_${Date.now()}.wav`;
        this.cleanup();
        this.recordedSubject.next({ blob, title });
      },
      // () => {
      //   this.cleanup();
      //   this.recordingFailedSubject.next('Recording failed');
      // },
    );
  }

  abortRecording(): void {
    this.cleanup();
  }

  private record(): void {
    if (!this.stream) return;

    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm',
    });

    this.recorder.record();
    this.startTime = Date.now();

    this.intervalId = window.setInterval(() => {
      if (!this.startTime) return;

      const diff = Date.now() - this.startTime;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      this.recordingTimeSubject.next(
        `${this.pad(minutes)}:${this.pad(seconds)}`,
      );
    }, 1000);
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private cleanup(): void {
    this.recorder = null;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.startTime = null;
  }
}
