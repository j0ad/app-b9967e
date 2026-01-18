
export enum AppType {
  PWA = 'PWA',
  ANDROID = 'Android (Capacitor/Native)',
  IOS = 'iOS (Capacitor/Native)',
  REACT_NATIVE = 'React Native Expo'
}

export interface AppConfig {
  url?: string;
  name: string;
  bundleId: string;
  primaryColor: string;
  type: AppType;
  fileName?: string;
  fileContent?: string; // Metadata or snippet of the project
}

export interface AnalysisResult {
  readinessScore: number;
  suggestions: string[];
  suggestedFeatures: string[];
  codeSnippet: string;
  androidRequirements: string[];
}
