import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function resetTo(routeName) {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: routeName }] });
  }
}

export default navigationRef;
