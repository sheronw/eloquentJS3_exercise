/* 16.3 A Monster
    author: SheronW
    date: 7/27/2019 */

    const monsterSpeed = 4;

    class Monster {
      constructor(pos) {
        this.pos = pos;
        this.speed = new Vec(monsterSpeed, 0);
      }

      get type() { return "monster"; }

      static create(pos) {
        return new Monster(pos.plus(new Vec(0, -1)));
      }

      update(time, state) {
        let newPos = this.pos.plus(this.speed.times(time));
  		if(!state.level.touches(newPos, this.size, "wall")){
        let m = new Monster(newPos);
        m.speed = this.speed;
        return m;
  		}
  		else{
        let m = new Monster(newPos);
        m.speed = this.speed.times(-1);
        return m;
  		}
      }

      collide(state) {
        let top = this.pos.y;
 		    let bottom = state.player.pos.y + state.player.size.y;
        if(bottom - top < 0.5){
           // the actor is jumping on
           return new State(state.level, state.actors.filter(a => a!=this), state.status);
        }
        else{
           return new State(state.level, state.actors, "lost");
        }

      }
    }

    Monster.prototype.size = new Vec(1.2, 2);

    levelChars["M"] = Monster;

    runLevel(new Level(`
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................
`), DOMDisplay);
