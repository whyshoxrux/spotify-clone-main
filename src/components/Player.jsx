import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  set_action,
  set_audio,
  set_currentTime,
  set_volume,
} from "../slices/songSlice";

const Player = () => {
  const state = useSelector((state) => state.song);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [playerTime, setPlayerTime] = useState(0);
  const [count, setCount] = useState(0);
  const [volume, setVolume] = useState(state.audio_volume);

  useEffect(() => {
    const artist = state.artists.find((a, i) => a.id === state?.audio?.id);
    if (artist) {
      setData(artist);
    }
    setPlayerTime(0);
    state.musics.forEach((m, i) => {
      if (m.id === state?.audio?.id) {
        setCount(i);
      }
    });
  }, [state.audio_id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.audio?.time && state.action === "play") {
        setPlayerTime((prev) => Math.min(prev + 1, state.audio.time));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.audio?.time, state.action]);

  const playHandler = () => {
    if (state.audio) {
      dispatch(set_action("play"));
    }
  };
  const pauseHandler = () => {
    if (state.audio) {
      dispatch(set_action("pause"));
    }
  };
  const setAudio = (c) => {
    dispatch(set_audio({ audio: state.musics[c], id: state.musics[c].id }));
  };

  const nextHandler = () => {
    const nextIndex = count >= state.musics.length - 1 ? 0 : count + 1;
    setCount(nextIndex);
    setAudio(nextIndex);
  };

  const prevHandler = () => {
    const prevIndex = count < 1 ? state.musics.length - 1 : count - 1;
    setCount(prevIndex);
    setAudio(prevIndex);
  };

  const getTime = (time) => {
    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minute}:${second}`;
  };

  const volumeRate = (rate) => {
    if (rate === 0) return "fa-volume-xmark";
    if (rate > 0 && rate < 30) return "fa-volume-off";
    if (rate >= 30 && rate < 70) return "fa-volume-low";
    return "fa-volume-high";
  };

  useEffect(() => {
    dispatch(set_currentTime(playerTime));
  }, [playerTime]);

  useEffect(() => {
    dispatch(set_volume(volume));
  }, [volume]);

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setPlayerTime(value);
    dispatch(set_currentTime(value));
  };

  return (
    <div className="fixed flex justify-between px-5 bottom-0 start-0 end-0 bg-black py-5">
      <div className="flex gap-4 items-center">
        {data?.images[0] ? (
          <img
            src={data.images[0].url}
            className="w-14 rounded h-14 object-contain"
            alt=""
          />
        ) : (
          <img
            src="https://img.freepik.com/free-vector/profile-music-notes-background_23-2147492175.jpg"
            className="w-14 rounded h-14 object-contain"
            alt=""
          />
        )}
        <div className="flex gap-4 items-center">
          <div className="text-white font-semibold">
            <h3 className="text-[13px]">{state.audio?.title}</h3>
            <p className="font-normal text-[11px] text-gray-400">
              {data?.name}
            </p>
          </div>
          <button className="w-5 h-5 rounded-full border-2 border-[#b3b3b3] text-[#b3b3b3] text-[11px] pt-0.5 flex items-center justify-center">
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-7 text-white text-xl">
          <button className="text-[#b3b3b3]">
            <i className="fa fa-shuffle"></i>
          </button>
          <button onClick={prevHandler} className="text-[#b3b3b3]">
            <i className="fa fa-backward-step"></i>
          </button>
          {state.action === "pause" ? (
            <button className="text-4xl" onClick={playHandler}>
              <i className="fa fa-circle-play"></i>
            </button>
          ) : (
            <button className="text-4xl" onClick={pauseHandler}>
              <i className="fa fa-circle-pause"></i>
            </button>
          )}
          <button onClick={nextHandler} className="text-[#b3b3b3]">
            <i className="fa fa-forward-step"></i>
          </button>
          <button className="text-[#b3b3b3]">
            <i className="fa fa-repeat"></i>
          </button>
        </div>
        <div className="text-[#b3b3b3] flex gap-2 text-[12px] items-center">
          <p>{getTime(playerTime)}</p>
          <input
            onChange={handleSliderChange}
            type="range"
            className="player w-[400px] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
            min={0}
            value={playerTime}
            max={state.audio?.time || 100}
          />
          <p>{state.audio && getTime(state.audio.time)}</p>
        </div>
      </div>
      <ul className="flex items-center gap-4">
        <li className="text-[8px] border-2 border-secondary hover:scale-[102%] text-secondary px-[3px] py-[2px] rounded-[2px] hover:border-white hover:text-white">
          <i className="fa fa-play"></i>
        </li>
        <li className="hover:scale-[102%] text-secondary hover:text-white">
          <i className="fa fa-microphone"></i>
        </li>
        <li className="hover:scale-[102%] text-secondary hover:text-white">
          <i className="fa fa-bars-progress"></i>
        </li>
        <li className="hover:scale-[102%] text-secondary hover:text-white">
          <i className="fa fa-computer"></i>
        </li>
        <li className="overflow-hidden flex items-center gap-2 text-secondary hover:text-white">
          <label className="player w-[140px]">
            <input
              onChange={(e) => setVolume(e.target.value)}
              max={100}
              min={0}
              value={volume}
              type="range"
              className="level"
            />
            <i className={`fa volume ${volumeRate(volume)}`}></i>
          </label>
        </li>
      </ul>
    </div>
  );
};

export default Player;
