import mentasuave01 from './assets/mentasuave01.svg';

function Footer() {
    const githubProfile = 'https://github.com/mentasuave01';

    return (
        <a href={githubProfile} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            <footer
                style={{
                    position: 'fixed',
                    bottom: 0, right: 0,
                    "background-color": 'black',
                    color: 'white',
                    padding: '10px',
                    "text-align": 'end',
                    "font-family": 'Arial, sans-serif',
                    "font-weight": 'bold',
                    display: 'flex',
                    "align-items": 'center',
                    gap: '10px'
                }}>
                Powered by mentasuave01
                <img src={mentasuave01} alt="mentasuave01" style={{ width: '30px', height: '30px', marginLeft: '10px' }}></img>

            </footer >
        </a>
    );
}

export default Footer;
