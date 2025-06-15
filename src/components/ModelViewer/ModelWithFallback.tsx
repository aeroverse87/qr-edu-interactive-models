
import { Suspense, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Model } from './Model';
import { Loader } from './Loader';
import PlaceholderModel from '../PlaceholderModel';
import { ViewerSettings } from './types';

interface ModelWithFallbackProps {
  url: string;
  modelId: string;
  title: string;
  settings: ViewerSettings;
}

export function ModelWithFallback({ url, modelId, title, settings }: ModelWithFallbackProps) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  if (usePlaceholder) {
    console.log(`Using placeholder fallback for: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }

  return (
    <ErrorBoundary onError={() => setUsePlaceholder(true)}>
      <Suspense fallback={<Loader modelTitle={title} />}>
        <Model url={url} settings={settings} />
      </Suspense>
    </ErrorBoundary>
  );
}
