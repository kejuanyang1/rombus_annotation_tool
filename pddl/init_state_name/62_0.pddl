(define (problem scene1)
  (:domain manip)
  (:objects
    black pen - item
    paper clip - item
    blue marker - item
    orange stripper - item
    tweezers - item
  )
  (:init
    (ontable black pen)
    (ontable paper clip)
    (ontable blue marker)
    (ontable orange stripper)
    (ontable tweezers)
    (clear black pen)
    (clear paper clip)
    (clear blue marker)
    (clear orange stripper)
    (clear tweezers)
    (handempty)
  )
  (:goal (and ))
)