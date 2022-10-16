import React from 'react';
import './App.css';

const Gender = {
  MALE: 'm',
  FEMALE: 'f'
}

const nouns = [
  { name: 'תפוח', file: 'apple.png', gender: Gender.MALE },
  { name: 'ספר', file: 'book.png', gender: Gender.MALE },
  { name: 'חתול', file: 'cat.png', gender: Gender.MALE },
  { name: 'קפה', file: 'coffee.png', gender: Gender.MALE },
  { name: 'מחשב', file: 'computer.png', gender: Gender.MALE },
  { name: 'פינגווין', file: 'penguin.png', gender: Gender.MALE },
  { name: 'עציץ', file: 'plant.png', gender: Gender.MALE },
  { name: 'מקל', file: 'stick.png', gender: Gender.MALE },
  { name: 'שעון', file: 'watch.png', gender: Gender.MALE },
  { name: 'שוקולד', file: 'chocolate.png', gender: Gender.MALE },
  { name: 'חתולה', file: 'femalecat.png', gender: Gender.FEMALE },
  { name: 'בננה', file: 'banana.png', gender: Gender.FEMALE },
  { name: 'מכונית', file: 'car.png', gender: Gender.FEMALE },
  { name: 'קלמנטינה', file: 'clemantine.png', gender: Gender.FEMALE },
  { name: 'פיצה', file: 'pizza.png', gender: Gender.FEMALE },
  { name: 'חללית', file: 'spaceship.png', gender: Gender.FEMALE },
]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div class="push"></div>
        <WordsComponent/>
        <div class="question">מה עדיף?</div>
        <div class="footer">
        <p>אתם משתתפים בניסוי שמטרתו למצוא את מילת התואר המחמיאה ביותר בעברית. <strong>שימו לב, מספר השאלות בסקר הוא לא מוגבל: תמשיכו לקבל עוד ועוד שאלות עד שתחליטו להפסיק</strong>. להסברים נוספים, אתם מוזמנים להאזין לפרק "<a href="https://www.osimhistoria.com/theanswer/ep121-sabbaba">אחלה או סבבה?</a>" של הפודקאסט <a href="https://www.osimhistoria.com/theanswer" target="_blank" rel="noreferrer noopener">"התשובה" עם דורון פישלר</a>.</p>
        <p>קודד: עידן זיירמן (וגם לו יש פודקאסטים! האזינו ל<a rel="noreferrer noopener" href="https://tzofim.podbean.com/" target="_blank">"צופים בין כוכבים"</a> שבכל שבוע נערך בו דיון קצר ומשעשע על פרק ״מסע בין כוכבים״ לפי הסדר, או <a rel="noreferrer noopener" href="https://www.gamepad.co.il/" target="_blank">״גיימפוד״</a> - פודקאסט משחקי המחשב והקונסולות הוותיק ביותר בעברית).</p>
        <p>נמאס לכם רק להחמיא? נסו את הניסוי המקביל - <a href="https://magarooah.herokuapp.com/" rel="noreferrer noopener">מה גרוע יותר</a>?</p>
      </div>
      </header>

    </div>
  );
}


async function getWordPairFromServer() {
  var response = await fetch('/words');
  return await response.json();
}

function getRandomNounIndex() {
  return Math.floor(Math.random() * nouns.length);
}

export default App;

class WordsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.retrieveNewWords = this.retrieveNewWords.bind(this);
    this.state = {words: [], nounIndex: -1};
  }

  componentDidMount() {
    this.retrieveNewWords();
  }

  async retrieveNewWords() {
    this.setState({words: await getWordPairFromServer(), nounIndex: getRandomNounIndex()});
  }

  render() {
    return (
      <div class="selection">
        <WordComponent winner={this.state.words[0]} loser={this.state.words[1]} uuid={this.state.words[2]} nounIndex={this.state.nounIndex} retrieveWordsCallback={this.retrieveNewWords}/>
        <WordComponent winner={this.state.words[1]} loser={this.state.words[0]} uuid={this.state.words[2]} nounIndex={this.state.nounIndex} retrieveWordsCallback={this.retrieveNewWords}/>
      </div>
    );
  }
}

class WordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {winner: props.winner, loser: props.loser, uuid: props.uuid, nounIndex: props.nounIndex, retrieveWordsCallback: props.retrieveWordsCallback};
  }

  sendWordToServer(winner, loser, uuid, item) {
    fetch('/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({uuid, winner, loser, item}),
    }).then (async response => {
      if (response.ok) {
        await this.props.retrieveWordsCallback();
      }
    });
  }

  componentDidMount() {
    this.setState({winner: this.props.winner, loser: this.props.loser, uuid: this.props.uuid, nounIndex: this.props.nounIndex});
  }

  convertToFemale(word) {
    switch(word) {
      case 'טוב':
        return 'טובה';
      case 'מצוין':
        return 'מצויינת';
      case 'נפלא':
        return 'נפלאה';
      case 'אדיר':
        return 'אדירה';
      case 'גדול':
        return 'גדולה';
      case 'מדהים':
        return 'מדהימה';
      case 'מושלם':
        return 'מושלמת';
      case 'מהמם':
        return 'מהממת';
      case 'פנטסטי':
        return 'פנטסטית';
      case 'לא רע':
        return 'לא רעה';
      case 'סביר':
        return 'סבירה';
      case 'יוצא מן הכלל':
        return 'יוצאת מן הכלל';
      case 'משובח':
        return 'משובחת';
      case 'נהדר':
        return 'נהדרת';
      case 'מוצלח':
        return 'מוצלחת';
      case 'טוב מאוד':
        return 'טובה מאוד';
      default: return word;
    }
  }

  render() {
    const nounData = nouns[this.props.nounIndex]
    const noun = nounData?.name;
    const gender = nounData?.gender
    const file = nounData?.file

    return (
      <div class="option" onClick={()=>this.sendWordToServer(this.props.winner, this.props.loser, this.props.uuid, noun)}>
        <div class="title">ה{noun} {gender  === Gender.MALE? 'הזה' : 'הזו'} </div>
        <div class="word">{gender === Gender.MALE ? this.props.winner: this.convertToFemale(this.props.winner)}</div>

        <div class="picture">
          <img src={file} alt={noun} class="picture"/>
        </div>
      </div>
    );
  }
}
