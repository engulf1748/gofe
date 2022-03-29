import PageTitle from '../components/util/PageTitle';
import Layout from '../components/layout/Layout';


const Privacy = () => {
	return (
		<div className="w-100p py-8r">
			<PageTitle>Gofë - Privacy</PageTitle>

			<div className="container flex-c">
				<div className="mw-35r w-100p">
					<p className='text-tertiary'>Last updated: <span className='fw-500'>28 March 2022</span></p>
					<h1 className='fs-5xl'>Privacy Policy</h1>
					<p>Gofë is an open-source front-end for Google Search. We act as a middleperson between you and Google Search: we fetch results on your behalf and deliver them to you privately. When you use Gofë, Google does not know that <strong>you</strong> made the request: it thinks that the request came from our servers.</p>
					<p>Our servers do not collect any personally identifiable information. We store minimal logs to let us know if something has gone wrong: </p>
					<ul>
						<li>
							<p>The date and time of requests</p>
						</li>
						<li>
							<p>The endpoint that was hit (but not your search query)</p>
						</li>
						<li>
							<p>The HTTP status code from the response</p>
						</li>
						<li>
							<p>The total time it took to fulfill the request, in microseconds</p>
						</li>
					</ul>

					<p>This website uses <code>localStorage</code> to save your preferences in your browser. None of this information is sent to our server and can be deleted at any time by clearing your browser cache and site data.</p>

					<h2 className='fs-3xl'>Contacting us</h2>
					<p>If you have any questions about the information we collect, our project, or something else, feel free to reach out. If you're reporting a bug, please <a href='https://codeberg.org/ar324/gofe/issues' target='_blank' rel='noreferrer noopener nofollow' className='g-link'>open an issue</a> instead.</p>
					<p>You can email us at: services [@] infinium [.] earth</p>
				</div>
			</div>
		</div>
	);
};


Privacy.layout = Layout;

export default Privacy;
