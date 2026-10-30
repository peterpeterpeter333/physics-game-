# C-1 史実と制作上の確認

2026-10-23。正本・台本は変更していない。

- 1642年、税務を担当する父を助けるための計算機と、繰り上がりのソトワールは、[Musée des Arts et Métiers の収蔵品解説](https://www.arts-et-metiers.net/musee/machine-arithmetique-de-pascal-6-chiffres-sans-sous-ni-deniers)で確認した。
- エネルギーを、回転につれて少しずつ持ち上がるソトワールへ蓄える説明は、[同館のパスカル資料](https://www.arts-et-metiers.net/sites/arts-et-metiers/files/2021-10/field_media_document-330-cp_blaise_pascal.pdf)と整合する。
- 約50台を作った点は、[ケンブリッジ大学 Whipple Museum の計算機解説](https://www.whipplemuseum.cam.ac.uk/explore-whipple-collections/calculating-devices/mechanical-calculation)で確認した。
- 12・20で繰り上がる貨幣の桁については、[Computer History Museum の展示資料](https://tcm.computerhistory.org/CHMfiles/Pocket%20Computing%20Exhibit%201980-1984.pdf)が、ドゥニエ12分割・ソル20分割を説明している。

## 正本・制作指示に対する疑問（直していない）

- 指示の `arm(d)=60°×d/9` は模型の動きを分かりやすくする線形の約束として実装した。[Cnam の1942年のカタログ](https://cnum.cnam.fr/pgi/redir.php?ident=M6115&onglet=c)の説明では、実機の重りが上がり始めるのは数字4に到達したとき。実機の正確な軌跡と同じとは言わない。
- 行38の得点時刻は、制作表では「ありませんでした」の後、固定台本とcue時刻一覧では「高くて」。字幕・顔・音の固定時刻を優先し、得点を「高くて」の307.65秒にそろえた。
- 「だから」の紙札は指定座標のままだと、長い「予言」の札と重なるため、読める大きさを保ち680pxの段へ下げた。日本語は同じ。
- ミオの「ドミノ倒しみたいです！」は台本で全画面の顔が区間全体に出る。机のドミノはその下で動くため、全画面の顔の間は見えない。この顔の時刻は固定台本どおり。

## 確認の範囲

見本の1秒ごとの全コマ一覧50枚をすべて目視した。見本の3D本体は `desk_lib.py` と `desk_1_1v6.py` の差分も照合し、材質・部屋・光・手・カメラの実装が保持されることを確認した。音は数値で確認し、耳での確認は行っていない。
