const badges = [
  {
    id: 'ActiveDeveloper',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjQxNjQgNi4wMDAxMkw2IDEzLjQxNjVWNDYuNTgzOEwxMy40MTY1IDU0LjAwMDFINDYuNTgzNEw1NCA0Ni41ODM4VjEzLjQxNjVMNDYuNTgzNyA2LjAwMDEySDEzLjQxNjRaTTI2LjU3NDYgNDMuMjc2NkgxOS45MzY1QzE5LjkzNjUgMzcuNzg1NyAxNS40NzAxIDMzLjMxOTMgOS45NzkyNiAzMy4zMTkzVjI2LjY4MDlDMTUuNDcwMSAyNi42ODA5IDE5LjkzNjUgMjIuMjE0NiAxOS45MzY1IDE2LjcyMzdIMjYuNTc0NkMyNi41NzQ2IDIyLjE3MTQgMjMuOTAwNSAyNi45NzI1IDE5LjgzMzkgMzAuMDAwMUMyMy45MDA1IDMzLjAyOCAyNi41NzQ2IDM3LjgyODkgMjYuNTc0NiA0My4yNzY2Wk01MC4wMDAxIDMzLjMxOTNDNDQuNTA5MiAzMy4zMTkzIDQwLjA0MjggMzcuNzg1NyA0MC4wNDI4IDQzLjI3NjZIMzMuNDA0NEMzMy40MDQ0IDM3LjgyODkgMzYuMDc4OSAzMy4wMjggNDAuMTQ1NCAzMC4wMDAxQzM2LjA3ODkgMjYuOTcyNSAzMy40MDQ0IDIyLjE3MTQgMzMuNDA0NCAxNi43MjM3SDQwLjA0MjhDNDAuMDQyOCAyMi4yMTQ2IDQ0LjUwOTIgMjYuNjgwOSA1MC4wMDAxIDI2LjY4MDlWMzMuMzE5M1oiIGZpbGw9IiMyRUE5NjciLz4KPC9zdmc+Cg=='
  },
  {
    id: 'BugHunterLevel1',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQyLjEwOSAyNS44NjI3QzM3LjI4MzYgMzIuMDA0MSAzMC40NzQ3IDM1LjA3NDggMjUuMjEwNiAzMy45Njg2TDI0LjUzMDIgMzQuODM1NUw2Ljg0MzU2IDU3LjM3MDhDNi41MzQ0NiA1Ny43NjU2IDYuMTUwNTYgNTguMDk1NiA1LjcxMzgxIDU4LjM0MTlDNS4yNzcwNyA1OC41ODgyIDQuNzk2MDYgNTguNzQ1OSA0LjI5ODI4IDU4LjgwNjJDMy44MDA1MSA1OC44NjY0IDMuMjk1NzUgNTguODI3OSAyLjgxMjg3IDU4LjY5MjlDMi4zMjk5OSA1OC41NTc4IDEuODc4NDYgNTguMzI5IDEuNDg0MTIgNTguMDE5M0MxLjA4NTE2IDU3LjcxMTQgMC43NTExNjIgNTcuMzI3NSAwLjUwMTQxMSA1Ni44ODk4QzAuMjUxNjYxIDU2LjQ1MjEgMC4wOTExMTQzIDU1Ljk2OTMgMC4wMjkwNDUgNTUuNDY5MkMtMC4wMzMwMjQzIDU0Ljk2OTEgMC4wMDQ2MTQ1IDU0LjQ2MTYgMC4xMzk3ODcgNTMuOTc2MkMwLjI3NDk2IDUzLjQ5MDcgMC41MDQ5ODcgNTMuMDM2OCAwLjgxNjU3OSA1Mi42NDA4TDE5LjA4ODIgMjkuMjc2N0MxNi42NjYgMjQuNDMyMiAxOC4wMDExIDE3LjAxMjkgMjIuOTAyOCAxMC44MTQzQzI4Ljk4NyAzLjEwODkyIDM4LjE2MDkgMC4yMjkxOTQgNDMuNDgyMiA0LjM4NzA1QzQ4LjgwMzUgOC41NDQ5IDQ4LjE1NTEgMTguMTU3MyA0Mi4xMDkgMjUuODYyN1oiIGZpbGw9IiNCNEUxQ0UiLz4KPHBhdGggZD0iTTU3LjY5MTMgNDEuOTQxMkM2Ni4zODg1IDIwLjAwNzYgNDMuNDgyMiA0LjM4NzA1IDQzLjQ4MjIgNC4zODcwNUM0OC44MDM1IDguNTQ0OSA0OC4xNTUxIDE4LjE1NzMgNDIuMTA5IDI1Ljg2MjdDMzcuMjgzNiAzMi4wMDQxIDMwLjQ3NDcgMzUuMDc0OCAyNS4yMTA2IDMzLjk2ODZMMjQuNTMwMiAzNC44MzU1QzMzLjI5NzQgNDEuNTczNSA0My45Mzg5IDQ1LjY1NTQgMzguMTYwOSA1MS4zODIyQzMxLjY5NTIgNTcuNzkwNyA0OC45OTQyIDYzLjg3NDkgNTcuNjkxMyA0MS45NDEyWiIgZmlsbD0iIzNCQTU2MSIvPgo8L3N2Zz4K'
  },
  {
    id: 'BugHunterLevel2',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQzLjUyMDggNC4yNzc4M0M0My41MjA4IDQuMjc3ODMgNjYuNDYzMSAxOS45Njc3IDU3LjY0NjUgNDEuOTYxOUM0OC44Mjk4IDYzLjk1NjIgMzEuNjIzMSA1Ny44NDE0IDM4LjE2NDUgNTEuMzQ3NEM0NC43MDU5IDQ0Ljg1MzQgMzAuNTMyOSA0MC42MzQ3IDIxLjUyNjYgMzIuMTk3Mkw0My41MjA4IDQuMjc3ODNaIiBmaWxsPSIjRkZFQUMwIi8+CjxtYXNrIGlkPSJtYXNrMF81MDJfNzEzOCIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjU3Ij4KPHBhdGggZD0iTTQyLjE5MzMgMjUuODkzMkMzNy40MDU3IDMyLjAwNzkgMzAuNTMyNSAzNS4wODkgMjUuMTc2MiAzMy45NTE0TDYuODMxODMgNTcuNDYyNUM1LjUwNDYgNTkuMTY4OSAzLjE4MTkzIDU5LjM1ODUgMS40NzU0OCA1OC4wMzEzQy0wLjIzMDk3MSA1Ni43MDQgLTAuNDIwNTc3IDU0LjM4MTQgMC43MTcwNTcgNTIuNjc0OUwxOS4wNjE0IDI5LjM1MzVDMTYuNTk2NSAyNC41NjU5IDE3LjkyMzggMTcuMTIzOSAyMi45MDA5IDEwLjgxOTVDMjkuMDE1NyAzLjE0MDQ5IDM4LjE2NDEgMC4yOTY0MDggNDMuNTIwNSA0LjI3ODEyQzQ4Ljg3NjkgOC4yNTk4NCA0OC4xMTg0IDE4LjA3MTkgNDIuMTkzMyAyNS44OTMyWiIgZmlsbD0iI0ZGRDU2QyIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfNTAyXzcxMzgpIj4KPHBhdGggZD0iTTAgMi40ODMyNkg0Ny4yMzM0VjU5LjY2MDVIMFYyLjQ4MzI2WiIgZmlsbD0iI0ZGRDU2QyIvPgo8cGF0aCBkPSJNMzEuODM1NiAxLjA0NDc1TDM0LjA0NDQgMS4zMzU3M0wyOS41OTk2IDM1LjA3NDZMMjcuMzkwOCAzNC43ODM2TDMxLjgzNTYgMS4wNDQ3NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNS40NjYzIDAuODkxMTEzTDQwLjMwNjkgMS41Mjg4MUwzNS45NDMgMzQuNjUzNkwzMS4xMDI0IDM0LjAxNTlMMzUuNDY2MyAwLjg5MTExM1oiIGZpbGw9IndoaXRlIi8+CjwvZz4KPC9zdmc+Cg=='
  },
  {
    id: 'CertifiedModerator',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ1LjcyODQgMC40ODMyNzZIMTQuMjgzM0MxMy43OTE5IDYuODcwNTcgOC4zODczIDExLjc4MzkgMiAxMS43ODM5VjE0LjczMTlDMiAyOS4yMjYxIDguODc4NjIgNDIuNzM3NyAyMC45MTYyIDUyLjMxODZMMzAuMDA1OCA1OS40NDI5TDM5LjA5NTQgNTIuMzE4NkM1MS4xMzMgNDIuOTgzNCA1OC4wMTE3IDI5LjIyNjEgNTguMDExNyAxNC43MzE5VjExLjc4MzlDNTEuNjI0NCAxMS43ODM5IDQ2LjQ2NTQgNi44NzA1NyA0NS43Mjg0IDAuNDgzMjc2Wk0yNC4zNTU1IDQyLjk4MzRDMTYuOTg1NiAzNy4wODc0IDEyLjU2MzYgMjguNzM0OCAxMi41NjM2IDE5LjY0NTJWMTcuOTI1NUMxNi40OTQyIDE3LjkyNTUgMTkuOTMzNiAxNC45Nzc1IDIwLjE3OTIgMTEuMDQ2OUgzMC4wMDU4VjQ3LjY1MUwyNC4zNTU1IDQyLjk4MzRaIiBmaWxsPSIjRkY4QzE5Ii8+Cjwvc3ZnPgo='
  },
  {
    id: 'Hypesquad',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU4Ljc3MzcgMTYuNzkwOEwzNS4xNjU1IDMyLjI4NzJDMzQuNzYwMiAzMi41NTE0IDM0LjQzMjEgMzIuOTE4MSAzNC4yMTQ0IDMzLjM1MDFMMzAuNjE1NCA0MC41NjY5QzMwLjU2MzIgNDAuNjg2NiAzMC40NzcxIDQwLjc4ODYgMzAuMzY3OCA0MC44NjAyQzMwLjI1ODUgNDAuOTMxOCAzMC4xMzA3IDQwLjk2OTkgMzAgNDAuOTY5OUMyOS44NjkzIDQwLjk2OTkgMjkuNzQxNSA0MC45MzE4IDI5LjYzMjIgNDAuODYwMkMyOS41MjI5IDQwLjc4ODYgMjkuNDM2OCA0MC42ODY2IDI5LjM4NDYgNDAuNTY2OUwyNS43ODU2IDMzLjM1MDFDMjUuNTY3OSAzMi45MTgxIDI1LjIzOTggMzIuNTUxNCAyNC44MzQ1IDMyLjI4NzJMMS4yMjYyNyAxNi43OTA4QzEuMTA3NTggMTYuNjQ5OCAwLjkzNzc0NyAxNi41NjE4IDAuNzU0MTQ2IDE2LjU0NjFDMC41NzA1NDUgMTYuNTMwMyAwLjM4ODIxMiAxNi41ODgyIDAuMjQ3MjU5IDE2LjcwNjlDMC4xMDYzMDUgMTYuODI1NiAwLjAxODI3NzQgMTYuOTk1NCAwLjAwMjU0MDE5IDE3LjE3OUMtMC4wMTMxOTcgMTcuMzYyNiAwLjA0NDY0NTUgMTcuNTQ0OSAwLjE2MzM0MyAxNy42ODU5TDEwLjAyODEgMzYuODc0NkMxMC4wNzYgMzYuOTc1IDEwLjA5OTcgMzcuMDg1NCAxMC4wOTcgMzcuMTk2N0MxMC4wOTQ0IDM3LjMwNzkgMTAuMDY1NiAzNy40MTcgMTAuMDEyOSAzNy41MTUxQzkuOTYwMjIgMzcuNjEzMiA5Ljg4NTE5IDM3LjY5NzUgOS43OTM4NyAzNy43NjExQzkuNzAyNTYgMzcuODI0OCA5LjU5NzUzIDM3Ljg2NjEgOS40ODczIDM3Ljg4MTZIMy41NTcyNkMzLjQxMDgzIDM3Ljg4MDIgMy4yNjc3NSAzNy45MjU0IDMuMTQ4NzQgMzguMDEwOEMzLjAyOTczIDM4LjA5NjEgMi45NDA5NiAzOC4yMTcxIDIuODk1MjggMzguMzU2M0MyLjg0OTU5IDM4LjQ5NTQgMi44NDkzNiAzOC42NDU1IDIuODk0NjEgMzguNzg0N0MyLjkzOTg3IDM4LjkyNCAzLjAyODI2IDM5LjA0NTMgMy4xNDcwMSAzOS4xMzFMMjkuNTg5NyA1OC4wNzczQzI5LjcxMDYgNTguMTU5OCAyOS44NTM2IDU4LjIwNCAzMCA1OC4yMDRDMzAuMTQ2NCA1OC4yMDQgMzAuMjg5NCA1OC4xNTk4IDMwLjQxMDMgNTguMDc3M0w1Ni44NTMgMzkuMTMxQzU2Ljk3MTcgMzkuMDQ1MyA1Ny4wNjAxIDM4LjkyNCA1Ny4xMDU0IDM4Ljc4NDdDNTcuMTUwNiAzOC42NDU1IDU3LjE1MDQgMzguNDk1NCA1Ny4xMDQ3IDM4LjM1NjNDNTcuMDU5IDM4LjIxNzEgNTYuOTcwMyAzOC4wOTYxIDU2Ljg1MTMgMzguMDEwOEM1Ni43MzIyIDM3LjkyNTQgNTYuNTg5MiAzNy44ODAyIDU2LjQ0MjcgMzcuODgxNkg1MC41MTI3QzUwLjM5NiAzNy44NzcxIDUwLjI4MjIgMzcuODQzOCA1MC4xODE0IDM3Ljc4NDhDNTAuMDgwNyAzNy43MjU3IDQ5Ljk5NjEgMzcuNjQyNiA0OS45MzUyIDM3LjU0M0M0OS44NzQzIDM3LjQ0MzMgNDkuODM4OSAzNy4zMzAxIDQ5LjgzMjMgMzcuMjEzNUM0OS44MjU3IDM3LjA5NjkgNDkuODQ4MSAzNi45ODA1IDQ5Ljg5NzMgMzYuODc0Nkw1OS44MzY3IDE3LjY4NTlDNTkuOTU1NCAxNy41NDQ5IDYwLjAxMzIgMTcuMzYyNiA1OS45OTc1IDE3LjE3OUM1OS45ODE3IDE2Ljk5NTQgNTkuODkzNyAxNi44MjU2IDU5Ljc1MjcgMTYuNzA2OUM1OS42MTE4IDE2LjU4ODIgNTkuNDI5NSAxNi41MzAzIDU5LjI0NTggMTYuNTQ2MUM1OS4wNjIyIDE2LjU2MTggNTguODkyNCAxNi42NDk4IDU4Ljc3MzcgMTYuNzkwOFoiIGZpbGw9IiNGQkI4NDgiLz4KPHBhdGggZD0iTTMwLjUyMjMgMi41ODA4OUwzMi45NDY1IDcuNTIyNTlDMzIuOTg5NiA3LjYwNDIyIDMzLjA1MDYgNy42NzUxIDMzLjEyNDggNy43Mjk5N0MzMy4xOTkxIDcuNzg0ODUgMzMuMjg0NyA3LjgyMjMyIDMzLjM3NTQgNy44Mzk2TDM4LjgzOTIgOC42MjI4MUMzOC45NDYyIDguNjM4NTIgMzkuMDQ2NiA4LjY4Mzg5IDM5LjEyOSA4Ljc1Mzc4QzM5LjIxMTUgOC44MjM2NyAzOS4yNzI3IDguOTE1MjggMzkuMzA1NyA5LjAxODJDMzkuMzM4NyA5LjEyMTEzIDM5LjM0MjIgOS4yMzEyNSAzOS4zMTU4IDkuMzM2MDZDMzkuMjg5NCA5LjQ0MDg3IDM5LjIzNDEgOS41MzYxNyAzOS4xNTYzIDkuNjExMTVMMzUuMjAyOSAxMy40NTI2QzM1LjEzOTEgMTMuNTE4NyAzNS4wOTEgMTMuNTk4MiAzNS4wNjE5IDEzLjY4NTNDMzUuMDMyOSAxMy43NzI1IDM1LjAyMzcgMTMuODY1IDM1LjAzNTEgMTMuOTU2MUwzNS45Njc1IDE5LjM4MjdDMzUuOTg4IDE5LjQ4NzMgMzUuOTc4MiAxOS41OTU2IDM1LjkzOTIgMTkuNjk0OEMzNS45MDAyIDE5Ljc5NCAzNS44MzM3IDE5Ljg4IDM1Ljc0NzUgMTkuOTQyN0MzNS42NjEzIDIwLjAwNTQgMzUuNTU5IDIwLjA0MjIgMzUuNDUyNiAyMC4wNDg3QzM1LjM0NjIgMjAuMDU1MiAzNS4yNDAyIDIwLjAzMTEgMzUuMTQ3IDE5Ljk3OTRMMzAuMjYxMiAxNy40MjQ2QzMwLjE4MTggMTcuMzc4OCAzMC4wOTE4IDE3LjM1NDcgMzAuMDAwMSAxNy4zNTQ3QzI5LjkwODUgMTcuMzU0NyAyOS44MTg0IDE3LjM3ODggMjkuNzM5MSAxNy40MjQ2TDI0Ljg1MzMgMTkuOTc5NEMyNC43NjAxIDIwLjAzMTEgMjQuNjU0MSAyMC4wNTUyIDI0LjU0NzcgMjAuMDQ4N0MyNC40NDEzIDIwLjA0MjIgMjQuMzM5IDIwLjAwNTQgMjQuMjUyNyAxOS45NDI3QzI0LjE2NjUgMTkuODggMjQuMSAxOS43OTQgMjQuMDYxMSAxOS42OTQ4QzI0LjAyMjEgMTkuNTk1NiAyNC4wMTIzIDE5LjQ4NzMgMjQuMDMyOCAxOS4zODI3TDI0Ljk2NTIgMTMuOTU2MUMyNC45NzY2IDEzLjg2NSAyNC45Njc0IDEzLjc3MjUgMjQuOTM4MyAxMy42ODUzQzI0LjkwOTMgMTMuNTk4MiAyNC44NjExIDEzLjUxODcgMjQuNzk3NCAxMy40NTI2TDIwLjg0NCA5LjYxMTE1QzIwLjc2NjEgOS41MzYxNyAyMC43MTA5IDkuNDQwODcgMjAuNjg0NSA5LjMzNjA2QzIwLjY1OCA5LjIzMTI1IDIwLjY2MTUgOS4xMjExMyAyMC42OTQ1IDkuMDE4MkMyMC43Mjc2IDguOTE1MjggMjAuNzg4OCA4LjgyMzY3IDIwLjg3MTIgOC43NTM3OEMyMC45NTM3IDguNjgzODkgMjEuMDU0MSA4LjYzODUyIDIxLjE2MSA4LjYyMjgxTDI2LjYyNDkgNy44NTgyNUMyNi43MTU2IDcuODQwOTcgMjYuODAxMiA3LjgwMzUgMjYuODc1NCA3Ljc0ODYyQzI2Ljk0OTcgNy42OTM3NSAyNy4wMTA2IDcuNjIyODcgMjcuMDUzOCA3LjU0MTI0TDI5LjQ3OCAyLjU5OTU0QzI5LjUyMzEgMi40OTk5MiAyOS41OTU2IDIuNDE1MTUgMjkuNjg3IDIuMzU1MDdDMjkuNzc4MyAyLjI5NDk4IDI5Ljg4NDkgMi4yNjIwNSAyOS45OTQyIDIuMjYwMUMzMC4xMDM2IDIuMjU4MTUgMzAuMjExMiAyLjI4NzI1IDMwLjMwNDcgMi4zNDQwNEMzMC4zOTgyIDIuNDAwODIgMzAuNDczNiAyLjQ4Mjk1IDMwLjUyMjMgMi41ODA4OVoiIGZpbGw9IiNGQkI4NDgiLz4KPC9zdmc+Cg=='
  },
  {
    id: 'HypeSquadOnlineHouse1',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU1LjIzMTUgNC4wMDAxMkg0Ljc4MDI3QzQuNjc3OCA0LjAwMDEyIDQuNTc2MzQgNC4wMTg5IDQuNDgxNjcgNC4wNTUzOEM0LjM4NyA0LjA5MTg2IDQuMzAwOTkgNC4xNDUzMyA0LjIyODUzIDQuMjEyNzNDNC4wODIyMSA0LjM0ODg3IDQgNC41MzM1IDQgNC43MjYwMlYzNy4xNDQyQzQuMDAyMTkgMzcuMjUxIDQuMDI4NiAzNy4zNTYyIDQuMDc3NDkgMzcuNDUyOEM0LjEyNjM5IDM3LjU0OTUgNC4xOTY2NyAzNy42MzU1IDQuMjgzNzMgMzcuNzA1MUwyOS41MTgyIDU1Ljg1MjdDMjkuNjU2NiA1NS45NTU4IDI5LjgyODYgNTYuMDExOSAzMC4wMDU5IDU2LjAxMTlDMzAuMTgzMiA1Ni4wMTE5IDMwLjM1NTIgNTUuOTU1OCAzMC40OTM2IDU1Ljg1MjdMNTUuNzEwMyAzNy43MDUxQzU1LjgwMjUgMzcuNjM4NSA1NS44Nzc0IDM3LjU1MzYgNTUuOTI5NSAzNy40NTY1QzU1Ljk4MTcgMzcuMzU5NCA1Ni4wMDk4IDM3LjI1MjcgNTYuMDExOCAzNy4xNDQyVjQuNzI2MDJDNTYuMDExOCA0LjUzMzUgNTUuOTI5NiA0LjM0ODg3IDU1Ljc4MzMgNC4yMTI3M0M1NS42MzY5IDQuMDc2NiA1NS40Mzg1IDQuMDAwMTIgNTUuMjMxNSA0LjAwMDEyWk00OC4xMzgyIDE4LjczMjZMNDIuMjE1MyAyOS42NTQyQzQyLjE2MzUgMjkuNzQ0MyA0Mi4xNTEyIDI5Ljg0OTYgNDIuMTgwOSAyOS45NDhDNDIuMjEwNyAzMC4wNDY0IDQyLjI4MDIgMzAuMTMwMyA0Mi4zNzQ5IDMwLjE4MjFINDYuMDk4OUM0Ni4xNDU0IDMwLjE2NjUgNDYuMTk0OCAzMC4xNTk3IDQ2LjI0NDMgMzAuMTYyMUM0Ni4yOTM3IDMwLjE2NDQgNDYuMzQyMSAzMC4xNzU5IDQ2LjM4NjYgMzAuMTk1OUM0Ni40MzEyIDMwLjIxNTkgNDYuNDcxMSAzMC4yNDM5IDQ2LjUwMzkgMzAuMjc4NEM0Ni41MzY3IDMwLjMxMjggNDYuNTYxOCAzMC4zNTMgNDYuNTc3NyAzMC4zOTY2QzQ2LjYxMjggMzAuNDg4NiA0Ni42MDg1IDMwLjU4OTcgNDYuNTY1NSAzMC42Nzg4QzQ2LjUyMjYgMzAuNzY3OSA0Ni40NDQ0IDMwLjgzODIgNDYuMzQ3MSAzMC44NzVMMzAuMjQ1MyA0MS43MTQxQzMwLjE3MjkgNDEuNzYyNCAzMC4wODYxIDQxLjc4ODQgMjkuOTk3IDQxLjc4ODRDMjkuOTA4IDQxLjc4ODQgMjkuODIxMSA0MS43NjI0IDI5Ljc0ODggNDEuNzE0MUwxMy40NTE5IDMwLjk0MUMxMy40MDI4IDMwLjkyNjEgMTMuMzU3MyAzMC45MDIzIDEzLjMxODIgMzAuODcwOUMxMy4yNzkxIDMwLjgzOTUgMTMuMjQ3MSAzMC44MDEzIDEzLjIyNCAzMC43NTgzQzEzLjIwMDkgMzAuNzE1MyAxMy4xODcyIDMwLjY2ODUgMTMuMTgzNyAzMC42MjA2QzEzLjE4MDIgMzAuNTcyNyAxMy4xODcgMzAuNTI0NiAxMy4yMDM2IDMwLjQ3OTFDMTMuMjE3NyAzMC40MzQgMTMuMjQxNCAzMC4zOTIxIDEzLjI3MzQgMzAuMzU1OEMxMy4zMDU0IDMwLjMxOTYgMTMuMzQ1IDMwLjI4OTcgMTMuMzg5OCAzMC4yNjgxQzEzLjQzNDYgMzAuMjQ2NSAxMy40ODM2IDMwLjIzMzYgMTMuNTMzOSAzMC4yMzAyQzEzLjU4NDIgMzAuMjI2NyAxMy42MzQ3IDMwLjIzMjggMTMuNjgyNCAzMC4yNDgxSDE3LjIyOTFDMTcuMzQwNCAzMC4yMzk4IDE3LjQ0NDIgMzAuMTkyNyAxNy41MTk4IDMwLjExNjJDMTcuNTk1NSAzMC4wMzk4IDE3LjYzNzMgMjkuOTM5NiAxNy42MzY5IDI5LjgzNTdDMTcuNjU1MSAyOS43NzY0IDE3LjY1NTEgMjkuNzEzNSAxNy42MzY5IDI5LjY1NDJMMTEuODAyNyAxOC43MzI2QzExLjc2MzggMTguNjQ2NiAxMS43NjA0IDE4LjU1MDIgMTEuNzkzMSAxOC40NjE5QzExLjgyNTggMTguMzczNiAxMS44OTIzIDE4LjI5OTcgMTEuOTggMTguMjU0MkMxMi4wNDg3IDE4LjIxMyAxMi4xMjg4IDE4LjE5MTEgMTIuMjEwNSAxOC4xOTExQzEyLjI5MjMgMTguMTkxMSAxMi4zNzIzIDE4LjIxMyAxMi40NDExIDE4LjI1NDJMMjYuODQwNSAyNy4wNDc1QzI3LjA5MDYgMjcuMjEwNiAyNy4yOTY5IDI3LjQyNTEgMjcuNDQzNCAyNy42NzQ0TDI5LjYyNDYgMzEuNzgyNEMyOS42NTU0IDMxLjgyOTYgMjkuNjk2MSAzMS44NzA2IDI5Ljc0NDMgMzEuOTAzQzI5Ljc5MjQgMzEuOTM1MyAyOS44NDcgMzEuOTU4MyAyOS45MDQ5IDMxLjk3MDZDMjkuOTYyOCAzMS45ODI5IDMwLjAyMjggMzEuOTg0MyAzMC4wODEzIDMxLjk3NDZDMzAuMTM5NyAzMS45NjUgMzAuMTk1NSAzMS45NDQ1IDMwLjI0NTMgMzEuOTE0NEMzMC4zMDEyIDMxLjg3OTIgMzAuMzQ5MyAzMS44MzQ0IDMwLjM4NzIgMzEuNzgyNEwzMi41Njg0IDI3LjY3NDRDMzIuNzA4NyAyNy40MjYyIDMyLjkwOSAyNy4yMTE2IDMzLjE1MzYgMjcuMDQ3NUw0Ny41NzA3IDE4LjI1NDJDNDcuNjUyNyAxOC4xODM1IDQ3Ljc2MDQgMTguMTQ0MiA0Ny44NzIyIDE4LjE0NDJDNDcuOTg0IDE4LjE0NDIgNDguMDkxNyAxOC4xODM1IDQ4LjE3MzcgMTguMjU0MkM0OC4yMDggMTguMzE4MyA0OC4yMjU5IDE4LjM4ODkgNDguMjI1OSAxOC40NjA0QzQ4LjIyNTkgMTguNTMyIDQ4LjIwOCAxOC42MDI2IDQ4LjE3MzcgMTguNjY2N0w0OC4xMzgyIDE4LjczMjZaIiBmaWxsPSIjOUM4NEVGIi8+Cjwvc3ZnPgo='
  },
  {
    id: 'HypeSquadOnlineHouse2',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI5LjkwMjcgMy4wMDA1N0MyNi4zODk5IDIuOTgwMzIgMjIuOTA3NiAzLjY1MjE5IDE5LjY1NDUgNC45Nzc4MUMxNi40MDE0IDYuMzAzNDMgMTMuNDQxMyA4LjI1Njg0IDEwLjk0MzIgMTAuNzI2NUM4LjQ0NSAxMy4xOTYyIDYuNDU3NzQgMTYuMTMzNyA1LjA5NDg1IDE5LjM3MTRDMy43MzE5NiAyMi42MDkxIDMuMDIwMTMgMjYuMDgzNiAzIDI5LjU5NjRWMjkuOTAzOUMzLjAwMDM1IDM1LjIxMTcgNC41NzA3MSA0MC40MDA4IDcuNTEzNDQgNDQuODE4MUMxMC40NTYyIDQ5LjIzNTQgMTQuNjM5OCA1Mi42ODM1IDE5LjUzNzcgNTQuNzI4NUMyNC40MzU2IDU2Ljc3MzUgMjkuODI5IDU3LjMyMzkgMzUuMDM5IDU2LjMxMDVDNDAuMjQ5MSA1NS4yOTcxIDQ1LjA0MjkgNTIuNzY1MiA0OC44MTczIDQ5LjAzMzRDNTIuNTkxNyA0NS4zMDE2IDU1LjE3NzggNDAuNTM2NyA1Ni4yNTAzIDM1LjMzODRDNTcuMzIyOSAzMC4xNDAxIDU2LjgzMzggMjQuNzQwNyA1NC44NDQ2IDE5LjgxOTdDNTIuODU1NSAxNC44OTg3IDQ5LjQ1NTIgMTAuNjc2MSA0NS4wNzE3IDcuNjgzM0M0MC42ODgyIDQuNjkwNDkgMzUuNTE3NCAzLjA2MTIzIDMwLjIxMDEgMy4wMDA1N0gyOS45MDI3Wk00Ny4yNTcgMTkuNjU1TDQxLjQ2NjUgMzAuNTg3MUM0MS40NjY1IDMwLjkyODggNDEuNDY2NSAzMC45Mjg4IDQxLjgwODEgMzEuMjUzM0g0NS4yMjQzQzQ1LjU4MyAzMS4yNTMzIDQ1LjU4MzEgMzEuMjUzMyA0NS41ODMxIDMxLjYxMlYzMS45NTM2TDMwLjIxMDEgNDIuODUxNkgyOS45MDI3TDE0LjI3MzUgMzEuOTUzNlYzMS4yNTMzSDE4LjAzMTNDMTguMDc0NSAzMS4yNTgxIDE4LjExODIgMzEuMjUzOCAxOC4xNTk1IDMxLjI0MDVDMTguMjAwOCAzMS4yMjcyIDE4LjIzODkgMzEuMjA1MyAxOC4yNzEyIDMxLjE3NjNDMTguMzAzNCAzMS4xNDcyIDE4LjMyOTIgMzEuMTExNyAxOC4zNDY3IDMxLjA3MkMxOC4zNjQzIDMxLjAzMjIgMTguMzczMiAzMC45ODkzIDE4LjM3MjkgMzAuOTQ1OEwxMi41NDgzIDE5LjY1NVYxOC45NzE3SDEzLjI0ODZMMjYuOTEzNSAyNy44MTk5QzI3LjI1NTEgMjcuODE5OSAyNy4yNTUxIDI4LjE2MTYgMjcuNjEzOCAyOC41MjAzTDI5LjY0NjQgMzIuOTQ0NEMyOS45ODgxIDMyLjk0NDQgMjkuOTg4MSAzMy4yNjg5IDMwLjMyOTcgMzIuOTQ0NEwzMC42NzEzIDMyLjYwMjdMMzIuNzIxIDI4LjUyMDNDMzIuNzIxIDI4LjE2MTYgMzMuMDYyNiAyOC4xNjE2IDMzLjM4NzIgMjcuODE5OUw0Ny4wNTIgMTguNjQ3MkM0Ny4zOTM2IDE4LjY0NzIgNDcuMzkzNiAxOC42NDcyIDQ3LjM5MzYgMTguOTcxN1YxOS42NTVINDcuMjU3WiIgZmlsbD0iI0Y0N0I2NyIvPgo8L3N2Zz4K'
  },
  {
    id: 'HypeSquadOnlineHouse3',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU2LjUwMTggMjkuMzgxNUwzMC4zMDI1IDMuMTgyMjFDMzAuMTg0NCAzLjA2NTU0IDMwLjAyNSAzLjAwMDEyIDI5Ljg1OSAzLjAwMDEyQzI5LjY5MyAzLjAwMDEyIDI5LjUzMzYgMy4wNjU1NCAyOS40MTU1IDMuMTgyMjFMMy4xODIwOCAyOS4zODE1QzMuMDY1NDIgMjkuNDk5NyAzIDI5LjY1OSAzIDI5LjgyNUMzIDI5Ljk5MSAzLjA2NTQyIDMwLjE1MDQgMy4xODIwOCAzMC4yNjg1TDI5LjM4MTQgNTYuNTAxOUMyOS40OTk1IDU2LjYxODYgMjkuNjU4OSA1Ni42ODQgMjkuODI0OSA1Ni42ODRDMjkuOTkwOSA1Ni42ODQgMzAuMTUwMiA1Ni42MTg2IDMwLjI2ODQgNTYuNTAxOUw1Ni41MDE4IDMwLjMwMjZDNTYuNjE4NSAzMC4xODQ1IDU2LjY4MzkgMzAuMDI1MSA1Ni42ODM5IDI5Ljg1OTFDNTYuNjgzOSAyOS42OTMxIDU2LjYxODUgMjkuNTMzOCA1Ni41MDE4IDI5LjQxNTZWMjkuMzgxNVpNNDUuMTkzMSAyMy41MTRMNDAuMDc2MSAzMy4zODk5QzQwLjA0MiAzMy40ODA1IDQwLjA0NDIgMzMuNTgwOCA0MC4wODI0IDMzLjY2OThDNDAuMTIwNSAzMy43NTg5IDQwLjE5MTYgMzMuODI5NyA0MC4yODA3IDMzLjg2NzVINDMuNTA0NUM0My41NTEgMzMuODcxNiA0My41OTYyIDMzLjg4NTIgNDMuNjM3MiAzMy45MDc1QzQzLjY3ODMgMzMuOTI5OCA0My43MTQzIDMzLjk2MDMgNDMuNzQzMSAzMy45OTcxQzQzLjc3MTkgMzQuMDMzOCA0My43OTI4IDM0LjA3NjEgNDMuODA0NiAzNC4xMjEzQzQzLjgxNjMgMzQuMTY2NSA0My44MTg3IDM0LjIxMzYgNDMuODExNSAzNC4yNTk4QzQzLjgxMjIgMzQuMzA2MyA0My44MDE3IDM0LjM1MjIgNDMuNzgwOSAzNC4zOTM4QzQzLjc2MDIgMzQuNDM1MyA0My43Mjk3IDM0LjQ3MTMgNDMuNjkyMSAzNC40OTg2TDMwLjE4MzEgNDQuMjU1MUMzMC4xMTk5IDQ0LjI4OCAzMC4wNDk3IDQ0LjMwNTIgMjkuOTc4NCA0NC4zMDUyQzI5LjkwNzEgNDQuMzA1MiAyOS44MzY5IDQ0LjI4OCAyOS43NzM3IDQ0LjI1NTFMMTYuMTk2NSAzNC41MTU2QzE2LjEzMTcgMzQuNDQ2MiAxNi4wOTU3IDM0LjM1NDggMTYuMDk1NyAzNC4yNTk4QzE2LjA5NTcgMzQuMTY0OCAxNi4xMzE3IDM0LjA3MzQgMTYuMTk2NSAzNC4wMDM5QzE2LjI1NiAzMy45NDE4IDE2LjMzMzYgMzMuOTAwMSAxNi40MTgyIDMzLjg4NDVIMTkuNDM3M0MxOS41MzY4IDMzLjg4NDUgMTkuNjMyMiAzMy44NDUgMTkuNzAyNiAzMy43NzQ2QzE5Ljc3MyAzMy43MDQzIDE5LjgxMjUgMzMuNjA4OCAxOS44MTI1IDMzLjUwOTNWMzMuMzg5OUwxNC42OTU1IDIzLjUxNEMxNC42NTM5IDIzLjQyNTUgMTQuNjQ4NSAyMy4zMjQ0IDE0LjY4MDMgMjMuMjMyQzE0LjcxMjIgMjMuMTM5NiAxNC43Nzg4IDIzLjA2MzMgMTQuODY2IDIzLjAxOTNDMTQuOTAzNSAyMy4wMDI0IDE0Ljk0NDMgMjIuOTkzNiAxNC45ODU0IDIyLjk5MzZDMTUuMDI2NiAyMi45OTM2IDE1LjA2NzMgMjMuMDAyNCAxNS4xMDQ4IDIzLjAxOTNMMjcuMjQ5MyAzMC45ODQ5QzI3LjQ3MTYgMzEuMTA1MSAyNy42NDYxIDMxLjI5NzcgMjcuNzQ0IDMxLjUzMDdMMjkuNjAzMSAzNS4yNDkxQzI5LjYyMTQgMzUuMjg5IDI5LjY0NzUgMzUuMzI0OCAyOS42Nzk5IDM1LjM1NDRDMjkuNzEyNCAzNS4zODM5IDI5Ljc1MDUgMzUuNDA2NSAyOS43OTIgMzUuNDIwOUMyOS44MzM1IDM1LjQzNTIgMjkuODc3NCAzNS40NDEgMjkuOTIxMiAzNS40Mzc5QzI5Ljk2NSAzNS40MzQ3IDMwLjAwNzYgMzUuNDIyNyAzMC4wNDY2IDM1LjQwMjZDMzAuMTE4MSAzNS4zNzA1IDMwLjE3NzggMzUuMzE2OCAzMC4yMTcyIDM1LjI0OTFMMzIuMDA4MiAzMS41NDc4QzMyLjEzMTMgMzEuMzMyIDMyLjMwMDEgMzEuMTQ1NyAzMi41MDI4IDMxLjAwMTlMNDQuNjQ3MyAyMy4wMTkzQzQ0LjY4OTggMjIuOTk5MSA0NC43MzYgMjIuOTg3NSA0NC43ODMgMjIuOTg1MUM0NC44MzAxIDIyLjk4MjggNDQuODc3MSAyMi45ODk3IDQ0LjkyMTUgMjMuMDA1NUM0NC45NjU4IDIzLjAyMTQgNDUuMDA2NiAyMy4wNDU4IDQ1LjA0MTUgMjMuMDc3NUM0NS4wNzY0IDIzLjEwOTEgNDUuMTA0OCAyMy4xNDczIDQ1LjEyNDkgMjMuMTg5OUM0NS4xNjI4IDIzLjIzMzcgNDUuMTg5IDIzLjI4NjQgNDUuMjAxIDIzLjM0MzFDNDUuMjEyOSAyMy4zOTk4IDQ1LjIxMDIgMjMuNDU4NiA0NS4xOTMxIDIzLjUxNFoiIGZpbGw9IiM0NUREQzAiLz4KPC9zdmc+Cg=='
  },
  {
    id: 'Partner',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ0LjM2ODUgMjEuMTIwNkwzNi43MTE5IDI2LjAwMjVDMzUuNjE4MiAyNi41NDUgMzUuMDcxMyAyNi41NDUgMzMuOTc3NCAyNi4wMDI1QzMzLjQzMDUgMjUuNDYwMSAzMi4zMzY4IDI0LjkxNzYgMzEuNzg5OSAyNC4zNzUyQzI5LjYwMjMgMjMuODMyOCAyNy45NjE3IDI0LjM3NTIgMjYuMzIwOSAyNS40NjAxTDIzLjU4NjQgMjcuMDg3NEw5LjkxNDA2IDM2LjMwOUM2LjYzMjcgMzcuOTM2MyAyLjgwNDQyIDM3LjM5MzkgMS4xNjM3MyAzNC4xMzkxQy0xLjAyMzg1IDMxLjQyNjkgMC4wNjk5NDMyIDI3LjYyOTggMi44MDQ0MiAyNS40NjAxTDE5LjIxMTIgMTQuNjExMkMyMy41ODY0IDExLjg5OSAyOS4wNTU0IDEwLjgxNDEgMzMuOTc3NCAxMS44OTlDMzguMzUyNSAxMi45ODM5IDQxLjYzNCAxNS4xNTM3IDQ0LjM2ODUgMTguNDA4M0M0NS40NjIzIDE5LjQ5MzMgNDQuOTE1NCAyMC41NzgxIDQ0LjM2ODUgMjEuMTIwNloiIGZpbGw9IiM1ODY1RjIiLz4KPHBhdGggZD0iTTYwIDMwLjY0MjNDNjAgMzIuNzk5MiA1OC45MDggMzQuOTU2MiA1Ny4yNjk4IDM2LjAzNDdMNDAuMzQzMyA0Ni44MTkxQzM3LjA2NzEgNDguOTc1OSAzMy43OTA5IDUwLjA1NDQgMjkuOTY4NyA1MC4wNTQ0QzI4LjMzMDcgNTAuMDU0NCAyNy4yMzg3IDUwLjA1NDQgMjUuNjAwNSA0OS41MTUxQzIxLjIzMjUgNDguNDM2OCAxNy45NTYzIDQ2LjI3OTggMTUuMjI2MiA0My4wNDQ1QzE0LjY4MDIgNDEuOTY2IDE1LjIyNjIgNDAuODg3NSAxNS43NzIyIDQwLjM0ODVMMjMuNDE2NSAzNS40OTU0QzIzLjk2MjUgMzQuOTU2MiAyNS4wNTQ1IDM0Ljk1NjIgMjUuNjAwNSAzNS40OTU0QzI2LjY5MjcgMzYuMDM0NyAyNy43ODQ3IDM2LjU3MzkgMjguMzMwNyAzNy4xMTNDMzAuNTE0OSAzNy4xMTMgMzIuMTUyOSAzNy4xMTMgMzMuNzkwOSAzNi4wMzQ3TDM3LjYxMzEgMzMuODc3N0w0OC41MzM0IDI2LjMyODVMNTAuMTcxNiAyNS4yNUM1Mi45MDE2IDIzLjYzMjUgNTcuMjY5OCAyNC4xNzE3IDU4LjkwOCAyNi44Njc4QzYwIDI4LjQ4NTUgNjAgMjkuNTYzOCA2MCAzMC42NDIzWiIgZmlsbD0iIzU4NjVGMiIvPgo8L3N2Zz4K'
  },
  {
    id: 'PremiumEarlySupporter',
    base64: 'PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjE3MjUgMTIuNTk5M0MxMS4xNzI1IDEyLjU5OTMgMTEuODY2OCAxMS42MDU2IDEyLjE1NDggMTEuMTY1NEMxMi40NDI4IDEwLjcyNTIgMTEuNDA5MyA5LjY4NTE1IDExLjAwODMgOS4zNTU2NEMxMC42MDczIDkuMDI2MTMgOS45NzQ4MiA5LjE5MDg4IDkuOTc0ODIgOS4xOTA4OEM0LjkyODU4IDExLjMzMDEgMi40MDQxMSAxNS43MTkzIDIuMDU5NjIgMTYuNTk3MkMxLjcxNTEzIDE3LjQ3NSAyLjkzNjk5IDE4LjQzMjcgMy44Mzg1OSAxOC45MDEyQzQuMjUzMDUgMTkuMTE3NCA0LjkxMjQzIDE4LjYzODYgNS4zMTg4MiAxOC4yODM0TDUuNDU2MDggMTguMTQ5NUw1LjY2ODY5IDE3Ljk0MzZMNS42NzEzOCAxNy45NDFMMTkuMzk5OCAzMS4wMjExTDI0LjcyMzMgMjUuOTI5MUwxMS4xNTM2IDEyLjYxNzNMMTEuMTcyNSAxMi41OTkzWiIgZmlsbD0iIzUyNjZGRiIvPgo8cGF0aCBkPSJNNDMuNjA0NyAyNi4zOTcyTDQ0LjMyODYgMjUuNzM4Mkw1MC44MzM2IDMxLjkwMTFDNTAuODc5MyAzMS45Mzk3IDUwLjkyNzggMzEuOTU1MiA1MC45NzA4IDMxLjk1NTJDNTEuMDk0NiAzMS45NTUyIDUxLjE5NjkgMzEuODQ3MSA1MS4xOTY5IDMxLjg0NzFDNTEuMTk2OSAzMS44NDcxIDU4LjM5ODkgMjUuMDEyMyA1OC40MjMxIDI0Ljk4OTFDNTguNjM1NyAyNC43ODgzIDU4LjQyMzEgMjQuNjc3NiA1OC40MjMxIDI0LjY3NzZMNTIuODY4MiAxOS4zMjgyTDUyLjg2MDIgMTkuMzM1OUw1Mi4wOTg1IDE4LjYyMjhMNTIuNTIzNyAxOC4yMzE1TDUzLjQzMzQgMTguMzMxOUw1My4yNjEyIDE3LjE3ODZMNTMuNDg5OSAxNi45NTcyTDUzLjE0ODEgMTUuMjk0MkM1MS45NjEzIDEzLjY4NTMgNDguNzEwMSAxMS4xMDg0IDQ4LjcxMDEgMTEuMTA4NEw0Ny4wMDkyIDEwLjgxNDlMNDYuODM3IDExLjAzMzdMNDUuNTU1OSAxMC44NTFMNDUuNjc5NyAxMS44OTYxTDQ1Ljc2MDQgMTEuOTczNEw0NS4zODEgMTIuMzM4OUw0My4yODE3IDEwLjM3NDdDNDMuMjgxNyAxMC4zNzQ3IDMxLjEwMDggNC4wNDcwNSAzMC40NTIyIDMuNzUzNThDMzAuMDg2MSAzLjU5MTQgMjkuODE3IDMuNDgzMjggMjkuNTU4NiAzLjQ4MzI4QzI5LjM1OTUgMy40ODMyOCAyOS4xNjU3IDMuNTQ3NjMgMjguOTQyMyAzLjY5OTUyQzI4LjQyNTYgNC4wNDcwNSAyOC43Mjk3IDQuNzQ3MjYgMjguNzI5NyA0Ljc0NzI2TDM2LjMwMzEgMTguMTMzN0wzNy44MTgzIDE5LjU3MDJMMzcuMTY5NyAyMC4xOTA2TDM1Ljk1ODYgMjAuMDMxTDM2LjE0NDMgMjEuMTc5MUwzNS43OTQ0IDIxLjUxMzhMMzUuNzMyNSAyMS40NTQ2QzM1LjY3NiAyMS40MDA1IDM1LjU5OCAyMS4zNzIyIDM1LjUyMjYgMjEuMzcyMkMzNS40NDczIDIxLjM3MjIgMzUuMzcxOSAyMS40MDA1IDM1LjMxMjcgMjEuNDU0NkMzNS4xOTcgMjEuNTY1MyAzNS4xOTcgMjEuNzQ1NSAzNS4zMTI3IDIxLjg1NjJMMzUuMzc0NiAyMS45MTU0TDM1LjIwNzcgMjIuMDc3NUwzNS4xNjQ3IDIyLjAzMzhDMzUuMTA1NSAyMS45Nzk3IDM1LjAzMDEgMjEuOTUxNCAzNC45NTQ3IDIxLjk1MTRDMzQuODc2NyAyMS45NTE0IDM0LjgwMTMgMjEuOTc5NyAzNC43NDQ4IDIyLjAzMzhDMzQuNjI5MSAyMi4xNDQ1IDM0LjYyOTEgMjIuMzI0NyAzNC43NDQ4IDIyLjQzNTRMMzQuNzkwNiAyMi40NzkxTDMxLjYwNCAyNS41NDI2TDMxLjUzMTQgMjUuNDczMUMzMS40NzIyIDI1LjQxOSAzMS4zOTY4IDI1LjM5MDcgMzEuMzIxNSAyNS4zOTA3QzMxLjI0NjEgMjUuMzkwNyAzMS4xNzA3IDI1LjQxOSAzMS4xMTE1IDI1LjQ3MzFDMzAuOTk1OCAyNS41ODM4IDMwLjk5NTggMjUuNzY0IDMxLjExMTUgMjUuODc0N0wzMS4xODY5IDI1Ljk0NDJMMzEuMDE3MyAyNi4xMDYzTDMwLjk2MDggMjYuMDU0OUMzMC45MDQzIDI1Ljk5ODIgMzAuODI2MiAyNS45Njk5IDMwLjc1MzYgMjUuOTY5OUMzMC42NzU1IDI1Ljk2OTkgMzAuNjAwMiAyNS45OTgyIDMwLjU0MSAyNi4wNTQ5QzMwLjQyNzkgMjYuMTY1NiAzMC40Mjc5IDI2LjM0MzIgMzAuNTQxIDI2LjQ1MzlMMzAuNTk3NSAyNi41MDc5TDMwLjE4MyAyNi45MDk1TDMwLjEyNjUgMjcuNDE5MkwzMC4zNDQ1IDI3LjYzMjlMMzAuMzM5MSAyNy42MzU1TDMwLjA3NTQgMjcuODkyOUwxMi44ODA1IDQ0LjMzNzZMMTIuNjU3MSA0NC4xNkwxMS45NDM5IDQ0LjI1NzhMMTEuNTQwMiA0NC42NDkxTDExLjUxMzMgNDQuNjIzNEMxMS40NTQxIDQ0LjU2NjggMTEuMzc4NyA0NC41Mzg0IDExLjMwMzQgNDQuNTM4NEMxMS4yMjggNDQuNTM4NCAxMS4xNDk5IDQ0LjU2NjggMTEuMDkzNCA0NC42MjM0QzEwLjk3NzcgNDQuNzM0MSAxMC45Nzc3IDQ0LjkxMTcgMTEuMDkzNCA0NS4wMjI0TDExLjEyNTcgNDUuMDUzM0wxMC45NTg5IDQ1LjIxODFMMTAuOTQyNyA0NS4yMDI2QzEwLjg4NjIgNDUuMTQ2IDEwLjgwODEgNDUuMTE3NyAxMC43MzI4IDQ1LjExNzdDMTAuNjU3NCA0NS4xMTc3IDEwLjU4MjEgNDUuMTQ2IDEwLjUyMjkgNDUuMjAyNkMxMC40MDk4IDQ1LjMxMzMgMTAuNDA5OCA0NS40OTA5IDEwLjUyMjkgNDUuNjAxNkwxMC41NDE3IDQ1LjYyMjJMNy4zOTU1NCA0OC42ODMxTDcuMzMwOTUgNDguNjIxM0M3LjI3MTc0IDQ4LjU2NDcgNy4xOTkwNyA0OC41Mzg5IDcuMTIxMDMgNDguNTM4OUM3LjA0NTY3IDQ4LjUzODkgNi45NzAzMSA0OC41NjQ3IDYuOTExMSA0OC42MjEzQzYuNzk1MzcgNDguNzMyIDYuNzk1MzcgNDguOTEyMiA2LjkxMTEgNDkuMDIyOUw2Ljk4MTA4IDQ5LjA4NzJMNi44MTQyMSA0OS4yNDk0TDYuNzYzMDggNDkuMjAwNUM2LjcwMzg3IDQ5LjE0NjUgNi42Mjg1MSA0OS4xMTgxIDYuNTUwNDYgNDkuMTE4MUM2LjQ3NzggNDkuMTE4MSA2LjM5OTc1IDQ5LjE0NjUgNi4zNDMyMyA0OS4yMDA1QzYuMjI3NSA0OS4zMTEyIDYuMjI3NSA0OS40OTE0IDYuMzQzMjMgNDkuNjAyMUw2LjM5NzA2IDQ5LjY1NjJMNi4xNjI5MSA0OS44ODUzTDQuOTQzNzQgNDkuNjc2OEw1LjAzNTI1IDUwLjk3OTRMNC42NTAzOSA1MS4zNTUyTDQuOTg0MTEgNTMuMTEwOUM0Ljk4NDExIDUzLjExMDkgNS40OTU0NiA1NC42NCA2LjU0Nzc3IDU1LjY1NDNDNy41Njc3OSA1Ni42Mzc3IDkuMTIzMzcgNTcuMTA4OCA5LjE5MDY2IDU3LjE1NzdMMTAuOTQ4MSA1Ny40NTEyTDExLjM4MTQgNTcuMDQ0NUwxMi41OTI1IDU3LjIzMjRMMTIuMzkzMyA1Ni4wODY4TDEyLjc2MiA1NS43NDE5TDEyLjkzMTYgNTUuOTA0QzEyLjk4ODEgNTUuOTU4MSAxMy4wNjM1IDU1Ljk4NjQgMTMuMTM4OCA1NS45ODY0QzEzLjIxNDIgNTUuOTg2NCAxMy4yOTIyIDU1Ljk1ODEgMTMuMzQ4OCA1NS45MDRDMTMuNDY0NSA1NS43OTA4IDEzLjQ2NDUgNTUuNjEzMSAxMy4zNDg4IDU1LjUwMjRMMTMuMTgxOSA1NS4zNDI4TDEzLjM1NDEgNTUuMTgzMkwxMy40OTk1IDU1LjMyMjJDMTMuNTU2IDU1LjM3ODkgMTMuNjM0IDU1LjQwNzIgMTMuNzA5NCA1NS40MDcyQzEzLjc4NDggNTUuNDA3MiAxMy44NjAxIDU1LjM3ODkgMTMuOTE5MyA1NS4zMjIyQzE0LjAzNSA1NS4yMTE1IDE0LjAzNSA1NS4wMzM5IDEzLjkxOTMgNTQuOTIzMkwxMy43NzY3IDU0Ljc4NDJMMTYuOTcxMyA1MS43Njk3TDE3LjExMTIgNTEuOTAzNUMxNy4xNjc4IDUxLjk2MDIgMTcuMjQ1OCA1MS45ODU5IDE3LjMyMTIgNTEuOTg1OUMxNy4zOTY1IDUxLjk4NTkgMTcuNDcxOSA1MS45NjAyIDE3LjUzMTEgNTEuOTAzNUMxNy42NDQxIDUxLjc5MjkgMTcuNjQ0MSA1MS42MTI3IDE3LjUzMTEgNTEuNTAyTDE3LjM5MzggNTEuMzczMkwxNy41NjM0IDUxLjIxMTFMMTcuNjgxOCA1MS4zMjQzQzE3LjczODMgNTEuMzc4NCAxNy44MTM3IDUxLjQwNjcgMTcuODg5IDUxLjQwNjdDMTcuOTY3MSA1MS40MDY3IDE4LjA0MjQgNTEuMzc4NCAxOC4wOTkgNTEuMzI0M0MxOC4yMTQ3IDUxLjIxMzYgMTguMjE0NyA1MS4wMzM0IDE4LjA5OSA1MC45MjI3TDE3Ljk4MzIgNTAuODEyTDE4LjM0MTIgNTAuNDc3NEwxOC40NzA0IDQ5Ljc0MzdMMTguMjc5MyA0OS41NjA5TDE4LjI4MiA0OS41NTgzTDE4LjYyOTEgNDkuMjI4OEwzNS43MDgzIDMyLjg4NzFMMzUuNzAwMiAzMi44NzE2TDM2LjAzNCAzMy4yMDEyTDM2LjU2OTUgMzMuMTQ0NUwzNy4wNTEzIDMyLjY4MTFMMzcuMTI5MyAzMi43NTU4QzM3LjE4ODUgMzIuODA5OSAzNy4yNjM5IDMyLjgzODIgMzcuMzM5MyAzMi44MzgyQzM3LjQxNDYgMzIuODM4MiAzNy40OTI3IDMyLjgwOTkgMzcuNTQ5MiAzMi43NTU4QzM3LjY2NDkgMzIuNjQ1MSAzNy42NjQ5IDMyLjQ2NDkgMzcuNTQ5MiAzMi4zNTQyTDM3LjQ3MTEgMzIuMjc5NkwzNy42NDA3IDMyLjExOTlMMzcuNjk5OSAzMi4xNzY2QzM3Ljc1NjQgMzIuMjMwNiAzNy44MzE4IDMyLjI1OSAzNy45MDk4IDMyLjI1OUMzNy45ODUyIDMyLjI1OSAzOC4wNjA1IDMyLjIzMDYgMzguMTE3MSAzMi4xNzY2QzM4LjIzMjggMzIuMDY1OSAzOC4yMzI4IDMxLjg4NTcgMzguMTE3MSAzMS43NzVMMzguMDU3OCAzMS43MTU4TDQxLjI0OTggMjguNjU3NUw0MS4zMzMyIDI4LjczNzNDNDEuMzg5NyAyOC43OTE0IDQxLjQ2NTEgMjguODE5NyA0MS41NDA0IDI4LjgxOTdDNDEuNjE4NSAyOC44MTk3IDQxLjY5MzggMjguNzkxNCA0MS43NTAzIDI4LjczNzNDNDEuODY2MSAyOC42MjY2IDQxLjg2NjEgMjguNDQ2NCA0MS43NTAzIDI4LjMzNTdMNDEuNjY2OSAyOC4yNTU5TDQxLjgzNjUgMjguMDkzN0w0MS45MDExIDI4LjE1ODFDNDEuOTYwMyAyOC4yMTIxIDQyLjAzNTYgMjguMjQwNSA0Mi4xMTEgMjguMjQwNUM0Mi4xODYzIDI4LjI0MDUgNDIuMjYxNyAyOC4yMTIxIDQyLjMyMDkgMjguMTU4MUM0Mi40MzY2IDI4LjA0NDggNDIuNDM2NiAyNy44NjcyIDQyLjMyMDkgMjcuNzU2NUw0Mi4yNTYzIDI3LjY5MjFMNDIuNjExNiAyNy4zNTIzTDQzLjc5ODUgMjcuNTI5OUw0My42MDQ3IDI2LjM5NzJaIiBmaWxsPSIjNTI2NkZGIi8+CjxwYXRoIGQ9Ik00NS45NzY3IDQ0Ljg2NzhMMzguNDA2IDM5LjM3OTRMMzcuMDU3NiAzOC4wNTFMMzEuODMzNyA0My4wNDc3TDMzLjE0NzEgNDQuMjQ3NEwzOC4wODAzIDUxLjMyNDJMNDQuNzMzMyA1OC4yOTI4TDUyLjQwMDkgNTEuNDUwM0w0NS45NzY3IDQ0Ljg2NzhaIiBmaWxsPSIjNTI2NkZGIi8+Cjwvc3ZnPgo='
  },
  {
    id: 'VerifiedDeveloper',
    base64: 'PHN2ZyB3aWR0aD0iNjEiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MSA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU1LjE1OTMgMjguODEzNUw0NC4yNjkgMTAuMDFMNDMuMzc4NCA4LjQ4MzI4SDE4LjE2MjhMMTcuMjcyMyAxMC4wMUw2LjQwNzQxIDI4LjgxMzVMNS41MTY4NSAzMC4zNDAyTDYuNDA3NDEgMzEuODY2OUwxNy4yNzIzIDUwLjY3MDVMMTguMTYyOCA1Mi4xOTcxSDQzLjQwMzlMNDQuMjk0NSA1MC42NzA1TDU1LjE4NDggMzEuODY2OUw1Ni4wNzUzIDMwLjM0MDJMNTUuMTU5MyAyOC44MTM1Wk0yMS45MDMyIDI2LjE5MjdMMTcuNzU1NyAzMC4zNDAyTDIxLjkwMzIgMzQuNDg3N1Y0MS40MzQxTDEwLjgwOTMgMzAuMzQwMkwyMS45Mjg2IDE5LjIyMDlWMjYuMTkyN0gyMS45MDMyWk0yOS44NDE5IDQzLjgyNTlMMjQuNjUxMiA0Mi4yMjI5TDMyLjUzOSAxNi44MjkxTDM3LjcyOTcgMTguNDU3NkwyOS44NDE5IDQzLjgyNTlaTTM5LjY2MzUgNDEuNDU5NVYzNC41MTMxTDQzLjgxMSAzMC4zNDAyTDM5LjY2MzUgMjYuMTkyN1YxOS4yMjA5TDUwLjc1NzQgMzAuMzQwMkwzOS42NjM1IDQxLjQ1OTVaIiBmaWxsPSIjM0U3MEREIi8+Cjwvc3ZnPgo='
  }
];

export default badges;