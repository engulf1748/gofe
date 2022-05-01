import PageTitle from '../components/util/PageTitle';
import Layout from '../components/layout/Layout';

import { resetLocalStorage } from '../logic/utils';

const Privacy = () => {
	return (
		<div className='w-100p py-8r'>
			<PageTitle>Gofë - Privacy</PageTitle>

			<div className='container flex-c'>
				<div className='mw-35r w-100p'>
					<p className='text-tertiary'>
						Last updated:{' '}
						<span className='fw-500'>17 April 2022</span>
					</p>
					<h1 className='fs-5xl'>Privacy Policy</h1>
					<p>
						Gofë is an open-source front-end for Google Search. We
						act as a middleperson between you and Google Search: we
						fetch results on your behalf and deliver them to you
						privately. When you use Gofë, Google does not know that{' '}
						<strong>you</strong> made the request: it thinks that
						the request came from our servers.
					</p>

					<h2>Your data</h2>
					<h3>Who we share your data with</h3>
					<p>
						Only your search query is sent to Google, nothing more.
						We do not make requests to any other service.
					</p>

					<h3>
						We <strong>do not...</strong>
					</h3>

					<ul>
						<li>
							<p>We <strong>do not</strong> store or collect any personally identifiable information.</p>
						</li>
						<li>
							<p>
								We <strong>do not collect</strong> your IP
								address.
							</p>
						</li>
						<li>
							<p>
								We <strong>do not</strong> attempt to uniquely
								identify your computer or browser via
								fingerprinting [soyerprinting] or any other method.
							</p>
						</li>
						<li>
							<p>
								We <strong>do not</strong> use analytics [soylytics] of any
								kind.
							</p>
						</li>
						<li>
							<p>
								We <strong>do not</strong> store cookies
								(although we do use localStorage, but this data
								is not sent to our servers).
							</p>
						</li>
					</ul>

					<h3>Information Contained in Our Logs</h3>

					<p>
						We use logs only to identify when and if something goes
						wrong. These <strong>do not</strong> contain any
						personally identifiable information. Most notably (and
						most importantly):{' '}
						<strong>
							our logs do not contain your search query
						</strong>
					</p>

					<ul>
						<li>
							<p>The date and time of requests</p>
						</li>
						<li>
							<p>
								The endpoint that was hit (
								<strong>but not your search query</strong>)
							</p>
						</li>
						<li>
							<p>The HTTP status code from the response</p>
						</li>
						<li>
							<p>
								The total time it took to fulfill the request,
								in microseconds
							</p>
						</li>
					</ul>

					<h3>Cookies {'&'} Local Storage</h3>

					<p>
						We <strong>do not</strong> use cookies.
					</p>

					<p>
						This website uses <code>localStorage</code> to save your
						preferences in your browser. None of this information is
						sent to our server and can be deleted at any time by
						clearing your browser cache and site data.
					</p>
					<p>
						If you'd like to clear your preferences on this website, <a className='g-link' onClick={resetLocalStorage}>click here.</a>
					</p>

					<h2>Contacting us</h2>
					<p>
						If you have any questions about the information we
						collect, our project, or something else, feel free to
						reach out. If you're reporting a bug, please{' '}
						<a
							href='https://codeberg.org/ar324/gofe/issues'
							target='_blank'
							rel='noreferrer noopener nofollow'
							className='g-link'
						>
							open an issue
						</a>{' '}
						instead.
					</p>
					<p>You can email us at: services [@] infinium [.] earth</p>
				</div>
			</div>
		</div>
	);
};

Privacy.layout = Layout;

export default Privacy;
