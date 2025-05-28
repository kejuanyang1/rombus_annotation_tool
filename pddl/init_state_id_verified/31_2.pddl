(define (problem generated)
  (:domain manip)
  (:objects
    container_05 - container
    office_02 office_04 office_05 office_10 - item
  )
  (:init
    (clear office_02)
    (clear office_04)
    (clear office_05)
    (clear office_10)
    (handempty)
    (ontable container_05)
    (ontable office_02)
    (ontable office_04)
    (ontable office_05)
    (ontable office_10)
  )
  (:goal (and))
)
