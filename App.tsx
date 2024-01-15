import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Button, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, Vibration, View} from 'react-native';
import { boxesList } from './constants';
import Circle from './assets/Circle.png';
import Tick from './assets/Tick.png';
import ButtonClick from './assets/ButtonClick.mp3';
import BoxClick from './assets/BoxClick.mp3';
import Draw from './assets/Draw.mp3';
import Success from './assets/Success.mp3';
import CrossPlaceholder from './assets/cross-placeholder.png';
import Sound from 'react-native-sound'

Sound.setCategory('Playback')
const clickSound = new Sound(ButtonClick, Sound.MAIN_BUNDLE)
const drawSound = new Sound(Draw, Sound.MAIN_BUNDLE)
const successSound = new Sound(Success, Sound.MAIN_BUNDLE)
const boxSound = new Sound(BoxClick, Sound.MAIN_BUNDLE)

type PropsTypes = PropsWithChildren<{
  boxNumber: number,
  mark: boolean | null
}>

function App(): React.JSX.Element {
  const [track, setTrack] = useState<Box[]>(JSON.parse(JSON.stringify(boxesList)))
  const [player, setPlayer] = useState<String>('First')
  const [status, setStatus] = useState<String>('Start the game.')
  const [countStep, setCountStep] = useState<number | null>(null)

  useEffect(() => {
    clickSound.setVolume(10);
    drawSound.setVolume(10);
    successSound.setVolume(10);
    boxSound.setVolume(10);
    return () => {
      clickSound.release();
      drawSound.release();
      successSound.release();
      boxSound.release();
    };
  }, []);

  function GetBoxValue(item: Box){
    Vibration.vibrate(10 * 6)
    boxSound.stop()
    boxSound.play()
    if(track[item.boxNumber].mark === null){
      const temp = track;
      let tempPlayer = player;
      countStep === null ? setCountStep(0) : setCountStep(countStep + 1);
      if(player === 'First'){
        temp[item.boxNumber].mark = true;
        tempPlayer = 'Second';
      }else if(player === 'Second'){
        temp[item.boxNumber].mark = false;
        tempPlayer = 'First';
      }
      if(countStep >= 3 && ((temp[4].mark !== null && 
        ((temp[2].mark === temp[4].mark && temp[4].mark === temp[6].mark) ||
        (temp[0].mark === temp[4].mark && temp[4].mark === temp[8].mark) ||
        (temp[1].mark === temp[4].mark && temp[4].mark === temp[7].mark) ||
        (temp[3].mark === temp[4].mark && temp[4].mark === temp[5].mark))) ||
        (temp[1].mark !== null && temp[0].mark === temp[1].mark && temp[1].mark === temp[2].mark) ||
        (temp[5].mark !== null && temp[2].mark === temp[5].mark && temp[5].mark === temp[8].mark) ||
        (temp[7].mark !== null && temp[8].mark === temp[7].mark && temp[7].mark === temp[6].mark) ||
        (temp[3].mark !== null && temp[6].mark === temp[3].mark && temp[3].mark === temp[0].mark))
      ){
        setStatus(player + ' player win the game.');
        tempPlayer = player;
        successSound.play()
      }else if(countStep === 7){
        setStatus('Game is draw.');
        drawSound.play()
      }else{
        setStatus(tempPlayer + ' player');
      }
      setPlayer(tempPlayer);
      setTrack({...temp})
    }
  }

  function reset(){
    clickSound.play()
    setTrack(JSON.parse(JSON.stringify(boxesList)));
    setPlayer('First');
    setStatus('Start the game.');
    setCountStep(null);
    drawSound.stop();
    successSound.stop();
  }
  function BoxLayout({...item}: PropsTypes): React.JSX.Element {
    return(
      <Pressable onPress={()=> GetBoxValue(item)} disabled={countStep === 8 || status === (player + ' player win the game.') || status === 'Game is draw.'}>
        <Image 
          style={styles.boxMark} 
          source={track[item.boxNumber].mark === null ? CrossPlaceholder : (track[item.boxNumber].mark ? Tick : Circle)}
        />
      </Pressable>
    )
  }
 
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.text}>{status}</Text>
        <FlatList
          numColumns={3}
          data={boxesList}
          renderItem={({item}) => (<BoxLayout {...item}/>)}
          keyExtractor={(item) => item.boxNumber.toString()}
        />
        <View style={styles.button}>
          <Button color={'black'} title='Restart' onPress={reset}/>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: '50%'
  },boxMark: {
    width: 60,
    height: 60,
    margin: 15
  },text: {
    color: 'black',
    letterSpacing: 1.5,
    fontSize: 20,
    marginBottom: 20
  },button:{
    marginBottom: 100,
    width: '60%'
  }
});

export default App;
