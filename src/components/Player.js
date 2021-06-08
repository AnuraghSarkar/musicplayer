import React from "react";
// Importing FA icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faAngleLeft,
    faAngleRight,
    faReply,
    faPause,
} from "@fortawesome/free-solid-svg-icons";
const Player = ({
    setIsPlaying,
    isPlaying,
    audioRef,
    setSongInfo,
    songInfo,
    songs,
    currentSong,
    setCurrentSong,
    setSongs
}) => {

    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map((song) => {
            if (song.id === nextPrev.id) {
                return { ...song, active: true }
            }
            else {
                return { ...song, active: false }
            }

        });
        setSongs(newSongs)
    }

    const playSongHandler = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };
    const getTime = (time) => {
        return `${Math.floor(time / 60)}:${("0" + Math.floor(time % 60)).slice(
            -2
        )}`;
    };

    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({ ...songInfo, currentTime: e.target.value });
    };
    const skipTrackHandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
        if (direction === "skip-forward") {
            await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex + 1) % songs.length])
        }
        if (direction === "skip-back") {
            if ((currentIndex - 1) % songs.length === -1) {
                await setCurrentSong(songs[songs.length - 1])
                activeLibraryHandler(songs[(currentIndex - 1)])
                return;
            }
            await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);

        }
        if (isPlaying) audioRef.current.play();
    };

    const replay = () => {
        if (isPlaying) {
            audioRef.current.load();
            setIsPlaying(isPlaying);
            audioRef.current.play();

        } else {
            audioRef.current.load();
            setIsPlaying(isPlaying);
        }
    };

    // Add the styles
    const trackAnimation = {
        transform: `translateX(${songInfo.animationPercentage})`
    }
    return (
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div style={{ background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})` }} className="track">
                    <input min={0} max={songInfo ? songInfo.duration : "0:00"} value={songInfo.currentTime} onChange={dragHandler} type="range" />
                    <div style={trackAnimation} className="animate-track"></div>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon
                    className="skip-back"
                    onClick={() => skipTrackHandler("skip-back")}
                    icon={faAngleLeft}
                    size="2x"
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                    onClick={playSongHandler}
                    className="play"
                    size="2x"
                    icon={isPlaying ? faPause : faPlay}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                    className="skip-forward"
                    onClick={() => skipTrackHandler("skip-forward")}
                    size="2x"
                    icon={faAngleRight}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                    onClick={replay}
                    size="2x"
                    icon={faReply}
                ></FontAwesomeIcon>
            </div>
        </div>
    );
};

export default Player;
