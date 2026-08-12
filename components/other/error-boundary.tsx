import React, { ReactNode, ReactElement } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { routes } from '@/constants/routes';
import { CircleAlert } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state
    this.setState({
      error,
      errorInfo,
    });

    // Log to console in development
    if (__DEV__) {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({
  error,
  errorInfo,
  onRetry,
}: {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onRetry: () => void;
}) {
  const router = useRouter();

  const handleGoHome = () => {
    onRetry();
    try {
      router.replace(routes.home);
    } catch (error) {
      console.error('Error navigating to home:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="flex-grow">
      <View className="flex-1 justify-center items-center p-6 gap-6">
        {/* Error Icon */}
        <View className="w-20 h-20 bg-destructive/10 rounded-full justify-center items-center">
          <Icon as={CircleAlert} size={40} className="text-destructive" />
        </View>

        {/* Error Title */}
        <View className="gap-2 items-center">
          <Text variant="h3">حدث خطأ غير متوقع</Text>
          <Text variant="muted" className="text-center">
            نأسف على الإزعاج، حاول مرة أخرى أو ارجع للشاشة الرئيسية
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 w-full gap-2">
            <Text variant="small" className="font-mono text-destructive">
              {error.toString()}
            </Text>
            {__DEV__ && errorInfo && (
              <Text variant="muted" className="text-xs">
                {errorInfo.componentStack}
              </Text>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View className="w-full gap-3">
          <Button className="w-full" onPress={onRetry}>
            <Text>إعادة المحاولة</Text>
          </Button>

          <Button variant="outline" className="w-full" onPress={handleGoHome}>
            <Text>الرجوع للرئيسية</Text>
          </Button>
        </View>

        {/* Development Info */}
        {__DEV__ && (
          <View className="bg-muted border border-border rounded-lg p-3 w-full gap-1">
            <Text variant="small">معلومات المطوّر</Text>
            <Text variant="muted" className="text-xs font-mono">
              {error?.message}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
