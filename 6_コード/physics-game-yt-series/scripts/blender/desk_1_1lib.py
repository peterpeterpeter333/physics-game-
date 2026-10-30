"""1-1 第6版の場面を desk_lib だけから組み立てる。引数は原版と同じ。"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import desk_lib

if __name__ == "__main__":
    desk_lib.main()
