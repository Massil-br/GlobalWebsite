import styles from './Home.module.scss'
import clickerImg from '../../Global/clicker.png'
import { Link } from 'react-router-dom';


export default function Home(){
    return (
    <div>
        <div className={styles.modulesGrid}>
            <div className={styles.moduleContainer}>
                <Link to="/clicker">
                    <img src={clickerImg} alt="clickerimage"></img>
                    <h2>Clicker</h2>
                    <h3>A clicker game where you can click to beat monsters and earn money to upgrade your damages or buy allies to  beat stronger enemies</h3>
                </Link>
            </div>
            <div className={styles.moduleContainer}>
                <Link to="/clicker">
                    <img src={clickerImg} alt="clickerimage"></img>
                    <h2>Clicker</h2>
                    <h3>A clicker game where you can click to beat monsters and earn money to upgrade your damages or buy allies to  beat stronger enemies</h3>
                </Link>
            </div>
            <div className={styles.moduleContainer}>
                <Link to="/clicker">
                    <img src={clickerImg} alt="clickerimage"></img>
                    <h2>Clicker</h2>
                    <h3>A clicker game where you can click to beat monsters and earn money to upgrade your damages or buy allies to  beat stronger enemies</h3>
                </Link>
            </div>
        </div>
    </div>
    );
}