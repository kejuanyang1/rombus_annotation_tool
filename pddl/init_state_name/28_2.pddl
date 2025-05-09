(define (problem scene1)
  (:domain manip)
  (:objects
    black tape - item
    pencil - item
    paper clip - item
    blue marker - item
    green marker - item
    USB drive - item
  )
  (:init
    (ontable black tape)
    (ontable pencil)
    (ontable paper clip)
    (ontable blue marker)
    (ontable green marker)
    (ontable USB drive)
    (clear black tape)
    (clear pencil)
    (clear paper clip)
    (clear blue marker)
    (clear green marker)
    (clear USB drive)
    (handempty)
  )
  (:goal (and ))
)