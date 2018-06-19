import PropTypes from 'prop-types';
import React from 'react'
import warning from './routerWarning'
import invariant from 'invariant'
import Redirect from './Redirect'
import { falsy } from './InternalPropTypes'

const { string, object } = PropTypes

/**
 * An <IndexRedirect> is used to redirect from an indexRoute.
 */
class IndexRedirect extends React.Component {
  static createRouteFromReactElement(element, parentRoute) {
    /* istanbul ignore else: sanity check */
    if (parentRoute) {
      parentRoute.indexRoute = Redirect.createRouteFromReactElement(element)
    } else {
      warning(
        false,
        'An <IndexRedirect> does not make sense at the root of your route config'
      )
    }
  }

  static propTypes = {
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: falsy,
    children: falsy
  };

  /* istanbul ignore next: sanity check */
  render() {
    invariant(
      false,
      '<IndexRedirect> elements are for router configuration only and should not be rendered'
    )
  }
}

export default IndexRedirect
