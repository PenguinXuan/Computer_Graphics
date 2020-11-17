class Camera {
	constructor() {
	  this.eye = new Vector3([0,0,3]);
	  this.at = new Vector3([0,0,-100]);
      this.up = new Vector3([0,1,0]);
	}
	moveForward() {
	  let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
	  f.normalize();
	  f.mul(0.2);
	  this.eye.add(f);
	  this.at.add(f);
	}
	moveBackwards() {
	  let f = new Vector3();
      f.set(this.eye);
      f.sub(this.at);
	  f.normalize();
	  f.mul(0.2);
	  this.eye.add(f);
	  this.at.add(f);
	}
	moveLeft() {
	  let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let s = new Vector3();
      s.set(this.up.cross(f));
      s.normalize();
      s.mul(0.2);
      this.eye.add(s);
	  this.at.add(s);
	}
	moveRight() {
	  let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let s = new Vector3();
      s.set(f.cross(this.up));
      s.normalize();
	  s.mul(0.2);
	  this.eye.add(s);
	  this.at.add(s);
	}
	panLeft() {
	  let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(5, this.up.elements[0],
        this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      let temp = new Vector3();
      temp.add(f_prime);
      this.at.set(temp);
	}
	panRight() {
	  let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(-5, this.up.elements[0],
        this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      let temp = new Vector3();
      temp.add(f_prime);
      this.at.set(temp);

	}
}