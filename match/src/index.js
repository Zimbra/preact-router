import { h, Component } from 'preact';
import { Link as StaticLink, exec, useRouter, segmentize } from 'preact-router';

class BasePathProvider extends Component {
	getChildContext() {
		return { 'preact-router-base': this.props.baseUrl };
	}
	render(props) {
		return props.children;
	}
}

export function Match(props, context) {
	let baseUrl = props.basePath || '';
	if (props.path) {
		let segments = segmentize(props.path);
		segments.forEach(segment => {
			if (segment.indexOf(':') === -1) {
				baseUrl = `${baseUrl  }/${  segment}`;
			}
		});
	}
	if (context && context['preact-router-base']) {
		baseUrl = context['preact-router-base'] + baseUrl;
	}

	const router = useRouter()[0];

	const route = props.basePath && props.path && !!props.path.indexOf(props.basePath)
		? props.basePath + props.path
		: props.path;

	return h(BasePathProvider, { baseUrl }, props.children({
		url: router.url,
		path: router.path,
		matches: exec(router.path || router.url, route, {}) !== false
	}));
}

export function Link({
	className,
	activeClass,
	activeClassName,
	path,
	...props
}) {
	const router = useRouter()[0];
	const matches =
		(path && router.path && exec(router.path, path, {})) ||
		exec(router.url, props.href, {});

	let inactive = props.class || className || '';
	let active = (matches && (activeClass || activeClassName)) || '';
	props.class = inactive + (inactive && active && ' ') + active;

	return h(StaticLink, props);
}

export default Match;
