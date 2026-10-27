import JSZip from 'jszip';
import { GRADLE_FILES } from './gradle-files.ts';
import { MANIFEST_AND_RESOURCES } from './manifest-and-resources.ts';
import { THEME_AND_COMPONENTS } from './theme-and-components.ts';
import { SCREENS_AND_NAVIGATION } from './screens-and-navigation.ts';
import { DATA_AND_SERVICES } from './data-and-services.ts';
import { TESTS_AND_DOCS } from './tests-and-docs.ts';

export interface AndroidFileItem {
  path: string;
  category: string;
  content: string;
  language: string;
}

export const ALL_ANDROID_PROJECT_FILES: Record<string, string> = {
  ...GRADLE_FILES,
  ...MANIFEST_AND_RESOURCES,
  ...THEME_AND_COMPONENTS,
  ...SCREENS_AND_NAVIGATION,
  ...DATA_AND_SERVICES,
  ...TESTS_AND_DOCS,
};

export function getCategorizedFiles(): Record<string, AndroidFileItem[]> {
  const categories: Record<string, AndroidFileItem[]> = {
    'Gradle Configuration': [],
    'Manifest & Resources': [],
    'Theme & Components': [],
    'Screens & Navigation': [],
    'ViewModels & Services': [],
    'Tests & Guides': [],
  };

  for (const [path, content] of Object.entries(ALL_ANDROID_PROJECT_FILES)) {
    let category = 'Other';
    let language = 'plaintext';

    if (path.endsWith('.kts') || path.endsWith('.properties') || path.endsWith('.toml')) {
      category = 'Gradle Configuration';
      language = path.endsWith('.kts') ? 'kotlin' : 'toml';
    } else if (path.includes('res/') || path.endsWith('.xml') || path.endsWith('.pro')) {
      category = 'Manifest & Resources';
      language = 'xml';
    } else if (path.includes('ui/components') || path.includes('ui/theme') || path.endsWith('Activity.kt') || path.endsWith('Application.kt')) {
      category = 'Theme & Components';
      language = 'kotlin';
    } else if (path.includes('ui/screens') || path.includes('navigation/')) {
      category = 'Screens & Navigation';
      language = 'kotlin';
    } else if (path.includes('viewmodel') || path.includes('data/') || path.includes('domain/') || path.includes('utils/')) {
      category = 'ViewModels & Services';
      language = 'kotlin';
    } else if (path.includes('test/') || path.endsWith('.md')) {
      category = 'Tests & Guides';
      language = path.endsWith('.md') ? 'markdown' : 'kotlin';
    }

    const item: AndroidFileItem = { path, category, content, language };
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  }

  return categories;
}

/**
 * Packages all Android Studio project files into a ready-to-unzip .zip file
 * and triggers an immediate download in the user's browser.
 */
export async function downloadAndroidProjectZip(onProgress?: (progress: number) => void): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('MayraAssistant');

  if (!rootFolder) {
    throw new Error('Failed to create root folder in ZIP archive.');
  }

  const fileEntries = Object.entries(ALL_ANDROID_PROJECT_FILES);
  for (const [relativePath, content] of fileEntries) {
    rootFolder.file(relativePath, content);
  }

  // Generate blob
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  // Trigger browser download
  const url = URL.createObjectURL(zipBlob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'MayraAssistant_AndroidStudio_Project.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
