import LoadingProcess from '@/components/loadingProcess';
import { PAGE } from '@/settings/config';
import { Context, initialState, reducer } from '@/settings/constant';
import '@/settings/global.less';
import { ActionType, TContext } from '@/settings/type';
import React, { Suspense, lazy, memo, useContext, useMemo, useReducer } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './landing';

const Pages = memo(() => {
	const [context] = useContext(Context);
	const page = context[ActionType.page];

	const Page = useMemo(() => {
		const [target] = Object.values(PAGE).filter((data) => data === page);
		const Element = lazy(() => import(`./${target}/index.tsx`));
		if (target) {
			return (
				<Suspense fallback=''>
					<Element>static pages</Element>
				</Suspense>
			);
		}
		return '';
	}, [page]);

	return Page;
});

const RoutePages = memo(() => (
	<Routes>
		<Route path='/' element={<Landing>RoutePages</Landing>} />
	</Routes>
));

const App = () => {
	const [state, setState] = useReducer(reducer, initialState);
	const value: TContext = useMemo(() => [state, setState], [state]);
	return (
		<div className='App'>
			<Context.Provider {...{ value }}>
				<BrowserRouter basename=''>
					<RoutePages />
				</BrowserRouter>
				<Pages />
				{state[ActionType.loadingProcess]?.enabled && <LoadingProcess />}
			</Context.Provider>
		</div>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
